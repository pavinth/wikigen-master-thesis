from django.utils import timezone


def create_future(days=1):
    assert type(days) is int
    future = timezone.now() + timezone.timedelta(days=days)

    return future.date()
