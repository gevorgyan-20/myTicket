import { create } from 'zustand';
import { saveDraftLayout, publishLayout, getAdminLayout } from '../../../../api/VenueService';

// ─── helpers ─────────────────────────────────────────────────────────────────

const uid = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const GRID = 30; // px – snap-to-grid step
export const snap = (v, enabled = true) => enabled ? Math.round(v / GRID) * GRID : v;

// Row-letter auto-labelling: A1, A2, … B1, B2, …
const rowLetter = (index) => {
    const letter = String.fromCharCode(65 + Math.floor(index / 20) % 26); // A-Z rows of 20
    const num = (index % 20) + 1;
    return `${letter}${num}`;
};

// ─── initial state (used for reset) ──────────────────────────────────────────

const INITIAL_STATE = {
    venueId:       null,
    layoutStatus:  'none',
    canvasWidth:   1200,
    canvasHeight:  800,

    seats:    [],
    sections: [],

    selectedId:      null,
    selectedTool:    'seat',
    activeSectionId: null,

    isDirty:      false,
    isSaving:     false,
    isPublishing: false,
    error:        null,

    // Zoom & pan
    stageScale:    1,
    stageX:        0,
    stageY:        0,

    // Grid snap
    gridSnap:      true,

    // Tooltip
    hoveredSeatId: null,
};

// ─── store ────────────────────────────────────────────────────────────────────

const useLayoutStore = create((set, get) => ({
    ...INITIAL_STATE,

    // ── actions ──────────────────────────────────────────────────────

    init: async (venueId) => {
        // ISSUE 1: Full reset before loading new venue — ensures unique state per venue
        set({ ...INITIAL_STATE, venueId });

        try {
            const { data } = await getAdminLayout(venueId);
            const snapshot = data.snapshot ?? { seats: [], sections: [] };

            let sections = snapshot.sections ?? [];
            // Auto-create default section if none exists
            if (sections.length === 0) {
                sections = [{ id: uid(), label: 'General', color: '#7C3AED' }];
            }

            // ISSUE 3: Ensure all seats have a valid section_id
            const sectionIds = new Set(sections.map(s => s.id));
            const defaultSectionId = sections[0].id;
            const seats = (snapshot.seats ?? []).map(seat => ({
                ...seat,
                section_id: seat.section_id && sectionIds.has(seat.section_id)
                    ? seat.section_id
                    : defaultSectionId,
            }));

            set({
                layoutStatus:    data.layout_status,
                canvasWidth:     data.canvas_width,
                canvasHeight:    data.canvas_height,
                seats,
                sections,
                activeSectionId: sections[0]?.id || null,
                isDirty:         false,
                stageScale:      1,
                stageX:          0,
                stageY:          0,
            });
        } catch (err) {
            set({ error: err.response?.data?.message || 'Failed to load layout.' });
        }
    },

    // ── seat CRUD ────────────────────────────────────────────────────

    addSeat: (x, y) => {
        const { seats, selectedTool, activeSectionId, sections, gridSnap } = get();
        const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];

        // ISSUE 3: Never allow null section_id
        const sectionId = activeSection?.id || sections[0]?.id;

        // ISSUE 6: Row-letter auto-labels (only count seats, not standing zones)
        const seatCount = seats.filter(s => s.type === 'seat').length;
        const label = rowLetter(seatCount);

        const newSeat = {
            id:         uid(),
            label,
            type:       selectedTool === 'select' ? 'seat' : selectedTool,
            x:          snap(x, gridSnap),
            y:          snap(y, gridSnap),
            rotation:   0,
            section_id: sectionId,
        };

        set({ seats: [...seats, newSeat], isDirty: true, selectedId: newSeat.id });
    },

    addZone: (x, y) => {
        const { seats, sections, gridSnap } = get();

        // ISSUE 3: Auto-create a new section for each standing zone
        const zoneNumber = seats.filter(s => s.type === 'standing').length + 1;
        const zoneLabel = `Standing ${zoneNumber}`;

        const sectionColors = ['#0891B2', '#D97706', '#DC2626', '#16A34A', '#BE185D', '#9333EA', '#2563EB'];
        const color = sectionColors[(sections.length) % sectionColors.length];

        const newSection = {
            id:    uid(),
            label: zoneLabel,
            color,
        };

        const newZone = {
            id:         uid(),
            label:      `GA ${zoneNumber}`,
            type:       'standing',
            x:          snap(x, gridSnap),
            y:          snap(y, gridSnap),
            width:      150,
            height:     100,
            capacity:   100,
            section_id: newSection.id,
        };

        set({
            sections:        [...sections, newSection],
            seats:           [...seats, newZone],
            isDirty:         true,
            selectedId:      newZone.id,
            activeSectionId: newSection.id,
        });
    },

    moveSeat: (id, x, y) => {
        const { gridSnap } = get();
        set((s) => ({
            seats:   s.seats.map((seat) => seat.id === id ? { ...seat, x: snap(x, gridSnap), y: snap(y, gridSnap) } : seat),
            isDirty: true,
        }));
    },

    updateSeat: (id, patch) => set((s) => ({
        seats:   s.seats.map((seat) => seat.id === id ? { ...seat, ...patch } : seat),
        isDirty: true,
    })),

    deleteSeat: (id) => set((s) => ({
        seats:      s.seats.filter((seat) => seat.id !== id),
        selectedId: s.selectedId === id ? null : s.selectedId,
        isDirty:    true,
    })),

    selectSeat: (id) => {
        const { seats } = get();
        const seat = seats.find(s => s.id === id);
        set({
            selectedId: id,
            activeSectionId: seat?.section_id || get().activeSectionId
        });
    },

    clearSelection: () => set({ selectedId: null }),

    // ── section CRUD ─────────────────────────────────────────────────

    addSection: (label = 'New Section', color = '#7C3AED') => {
        const s = { id: uid(), label, color };
        set((state) => ({
            sections:        [...state.sections, s],
            activeSectionId: s.id,
            isDirty:         true,
        }));
    },

    updateSection: (id, patch) => set((s) => ({
        sections: s.sections.map((sec) => sec.id === id ? { ...sec, ...patch } : sec),
        isDirty:  true,
    })),

    // ISSUE 3: When deleting a section, reassign orphaned seats to General (first section)
    deleteSection: (id) => set((s) => {
        const remaining = s.sections.filter((sec) => sec.id !== id);
        // Prevent deleting the last section
        if (remaining.length === 0) return s;

        const fallback = remaining[0].id;
        return {
            sections: remaining,
            seats: s.seats.map((seat) =>
                seat.section_id === id ? { ...seat, section_id: fallback } : seat
            ),
            activeSectionId: s.activeSectionId === id ? fallback : s.activeSectionId,
            isDirty: true,
        };
    }),

    setActiveSection: (id) => set({ activeSectionId: id }),

    // ── tool ─────────────────────────────────────────────────────────

    setTool: (tool) => set({ selectedTool: tool }),

    // ── grid snap toggle ─────────────────────────────────────────────

    toggleGridSnap: () => set((s) => ({ gridSnap: !s.gridSnap })),

    // ── zoom & pan ───────────────────────────────────────────────────

    setStageScale: (scale) => set({ stageScale: Math.max(0.2, Math.min(3, scale)) }),
    setStagePosition: (x, y) => set({ stageX: x, stageY: y }),

    zoomIn:  () => set((s) => ({ stageScale: Math.min(3, s.stageScale * 1.2) })),
    zoomOut: () => set((s) => ({ stageScale: Math.max(0.2, s.stageScale / 1.2) })),
    zoomReset: () => set({ stageScale: 1, stageX: 0, stageY: 0 }),

    // ── tooltip ──────────────────────────────────────────────────────

    setHoveredSeat: (id) => set({ hoveredSeatId: id }),

    // ── persistence ──────────────────────────────────────────────────

    // ISSUE 3: sanitize section_ids before persisting
    _sanitizedSnapshot: () => {
        const { seats, sections, canvasWidth, canvasHeight } = get();
        const sectionIds = new Set(sections.map(s => s.id));
        const defaultId = sections[0]?.id;
        const cleanSeats = seats.map(seat => ({
            ...seat,
            capacity: seat.type === 'standing' ? (seat.capacity ?? 100) : null,
            section_id: seat.section_id && sectionIds.has(seat.section_id)
                ? seat.section_id
                : defaultId,
        }));
        return { seats: cleanSeats, sections, canvas_width: canvasWidth, canvas_height: canvasHeight };
    },

    saveDraft: async () => {
        const { venueId } = get();
        if (!venueId) return;
        set({ isSaving: true, error: null });
        try {
            const snapshot = get()._sanitizedSnapshot();
            await saveDraftLayout(venueId, snapshot);
            set({ isDirty: false, layoutStatus: 'draft' });
        } catch (err) {
            set({ error: err.response?.data?.message || 'Failed to save draft.' });
        } finally {
            set({ isSaving: false });
        }
    },

    publish: async () => {
        const { venueId } = get();
        if (!venueId) return;
        set({ isPublishing: true, error: null });
        try {
            const snapshot = get()._sanitizedSnapshot();
            await publishLayout(venueId, snapshot);
            set({ isDirty: false, layoutStatus: 'published' });
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to publish layout.';
            set({ error: msg });
            return { success: false, message: msg };
        } finally {
            set({ isPublishing: false });
        }
    },
}));

export default useLayoutStore;
