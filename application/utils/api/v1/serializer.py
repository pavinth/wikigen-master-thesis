from rest_framework import serializers


class PersonMixin(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    class Meta:
        exclude = ['id']
