from rest_framework.viewsets import ModelViewSet
from .models import Category
from .serializers import CategorySerializer, RegisterSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    profile = getattr(user, 'profile', None)
    return Response({
        'id': user.id,
        'username': user.username,
        'profile': {
            'phone': profile.phone if profile else '',
            'photo': profile.photo.url if profile and profile.photo else ''
        }
    })


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': {
                    'id': user.id,
                    'username': user.username
                },
                'token': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        username = user.username
        user.delete()
        return Response({"detail": f"User '{username}' was deleted."}, status=status.HTTP_204_NO_CONTENT)