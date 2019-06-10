from rest_framework import serializers


class UUIDToObject(serializers.RelatedField):
    def to_internal_value(self, uuid):
        return self.get_queryset().get(uuid=uuid)

    def to_representation(self, obj):
        return str(obj.uuid)
