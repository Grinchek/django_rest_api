from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Profile

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['phone', 'photo']

class RegisterSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(write_only=True)
    photo = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'password', 'phone', 'photo']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        phone = validated_data.pop('phone')
        photo = validated_data.pop('photo', None)
        user = User.objects.create_user(**validated_data)

        profile, _ = Profile.objects.get_or_create(user=user)
        profile.phone = phone
        if photo:
            profile.photo = photo
        profile.save()

        return user


