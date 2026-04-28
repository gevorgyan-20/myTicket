<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SeatPurchased implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $eventType;
    public $eventId;
    public $seatId;

    public function __construct($eventType, $eventId, $seatId)
    {
        $this->eventType = $eventType;
        $this->eventId   = $eventId;
        $this->seatId    = $seatId;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel("events.{$this->eventType}.{$this->eventId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'SeatPurchased';
    }
}
