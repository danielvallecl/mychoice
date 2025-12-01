from django.db import models

class Item(models.Model):
    class Group(models.TextChoices):
        PRIMARY = "Primary", "Primary"
        SECONDARY = "Secondary", "Secondary"

    name = models.CharField(max_length=255)
    group = models.CharField(
        max_length=20,
        choices=Group.choices,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'group'],
                name='unique_name_per_group',
            )
        ]

    def __str__(self) -> str:
        return f"{self.name} ({self.group})"

