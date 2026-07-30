import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from apps.rooms.models import Room, RoomSession
from apps.friends.models import Friendship


class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.user = self.scope["user"]
        self.group_name = f"room_{self.room_id}"
        if not self.user or not self.user.is_authenticated:
            await self.close(code=4001)
            return
        if not await self.check_access():
            await self.close(code=4003)
            return
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send(text_data=json.dumps({"type": "room.state", "sessions": await self.get_room_state()}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        handlers = {
            "timer.start": lambda: self.update_session(status="running"),
            "timer.pause": lambda: self.update_session(status="paused"),
            "timer.break": lambda: self.update_session(status="break"),
            "timer.reset": lambda: self.update_session(status="idle"),
            "timer.complete": self.complete_session,
        }
        handler = handlers.get(data.get("type"))
        if not handler:
            return
        session = await handler()
        await self.channel_layer.group_send(self.group_name, {"type": "session.update", "user_id": str(self.user.id), "status": session.status, "session_count": session.session_count})

    async def session_update(self, event):
        await self.send(text_data=json.dumps({"type": "session.update", "user_id": event["user_id"], "status": event["status"], "session_count": event["session_count"]}))

    @database_sync_to_async
    def check_access(self):
        try:
            room = Room.objects.select_related("owner").get(id=self.room_id)
            return room.owner == self.user or Friendship.are_friends(self.user, room.owner)
        except Room.DoesNotExist:
            return False

    @database_sync_to_async
    def get_room_state(self):
        sessions = RoomSession.objects.filter(room_id=self.room_id).select_related("user__profile")
        return [{"user_id": str(s.user.id), "display_name": s.user.profile.display_name, "avatar_url": s.user.profile.avatar.url if s.user.profile.avatar else None, "status": s.status, "session_count": s.session_count} for s in sessions]

    @database_sync_to_async
    def update_session(self, status):
        session, _ = RoomSession.objects.get_or_create(room_id=self.room_id, user=self.user)
        session.status = status
        session.save(update_fields=["status", "updated_at"])
        return session

    @database_sync_to_async
    def complete_session(self):
        session, _ = RoomSession.objects.get_or_create(room_id=self.room_id, user=self.user)
        session.status = "idle"
        session.session_count += 1
        session.save(update_fields=["status", "session_count", "updated_at"])
        return session
