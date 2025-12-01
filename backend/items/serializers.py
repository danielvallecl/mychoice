# items/serializers.py
from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["id", "name", "group", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    """
    Checks that each group contains unique item names.
    If a duplicate is found, return a friendly error message.
    """
    def validate(self, attrs):
        # Pull updated values, falling back to existing ones when editing
        name = attrs.get("name") or getattr(self.instance, "name", None)
        group = attrs.get("group") or getattr(self.instance, "group", None)

        # Normalize spacing in the name field
        if name is not None:
            name = name.strip()

        # Don't run uniqueness checks until both values are present
        if not name or not group:
            return attrs

        # Base query: any item with the same name + group
        qs = Item.objects.filter(name=name, group=group)

        # If editing an existing item, ignore itself
        if self.instance is not None:
            qs = qs.exclude(pk=self.instance.pk)

        # If another item already uses this name in the same group
        if qs.exists():
            raise serializers.ValidationError(
                {"non_field_errors": ["Item already exists in this group."]}
            )

        return attrs
