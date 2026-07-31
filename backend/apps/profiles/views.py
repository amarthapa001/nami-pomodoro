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
        profile = serializer.save()
        url = profile.avatar.url if profile.avatar else ""
        if url:
            profile.profile_image_url = url
            profile.save(update_fields=["profile_image_url"])
            if hasattr(profile, "user") and profile.user:
                profile.user.profile_image_url = url
                profile.user.save(update_fields=["profile_image_url"])
            if not (url.startswith("http://") or url.startswith("https://")):
                url = request.build_absolute_uri(url)
        return Response({"avatar_url": url, "profile_image_url": url}, status=status.HTTP_200_OK)


class PublicProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.select_related("user")

    def get_object(self):
        return Profile.objects.get(user_id=self.kwargs["user_id"])
