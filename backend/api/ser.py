from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import Review, Detail, Group


class GroupSer(ModelSerializer):
    details_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'created_at', 'details_count']
    
    def get_details_count(self, obj):
        return obj.details.count()


class ReviewSer(ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class DetailSer(ModelSerializer):
    reviews = ReviewSer(many=True, read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Detail
        fields = ['id', 'name', 'nomer', 'group', 'group_name', 'status', 'status_display', 'created_at', 'updated_at', 'reviews']