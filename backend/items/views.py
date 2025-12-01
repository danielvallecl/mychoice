from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
from .models import Item
from .serializers import ItemSerializer

class ItemViewSet(viewsets.ModelViewSet):
    """
    Provides:
      - GET    /items/
      - POST   /items/
      - GET    /items/{id}/
      - PATCH  /items/{id}/
      - PUT    /items/{id}/
    """
    queryset = Item.objects.all().order_by('id')
    serializer_class = ItemSerializer

    def perform_create(self, serializer):
        try:
            serializer.save()
        except IntegrityError:
            raise ValidationError(
                {"detail": "Item with this name already exists in this group."}
            )

    def perform_update(self, serializer):
        try:
            serializer.save()
        except IntegrityError:
            raise ValidationError(
                {"detail": "Item with this name already exists in this group."}
            )

