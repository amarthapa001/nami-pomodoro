from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Profile
from .serializers import ProfileSerializer, AvatarUploadSerializer


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user.profile


class AvatarUploadView(APIView):
    def post(self, request):
        serializer = AvatarUploadSerializer(request.user.profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"avatar_url": request.user.profile.avatar.url}, status=status.HTTP_200_OK)


class PublicProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.select_related("user")

    def get_object(self):
        return Profile.objects.get(user_id=self.kwargs["user_id"])
