<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SeatLocked implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $eventType;
    public $eventId;
    public $seatId;
    public $userId;

    /**
     * Create a new event instance.
     */
    public function __construct($eventType, $eventId, $seatId, $userId = null)
    {
        $this->eventType = $eventType;
        $this->eventId = $eventId;
        $this->seatId = $seatId;
        $this->userId = $userId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel("events.{$this->eventType}.{$this->eventId}"),
        ];
    }

    public function broadcastAs()
    {
        return 'SeatLocked';
    }
}
