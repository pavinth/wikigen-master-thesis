from datetime import date

from django.core.exceptions import ValidationError


LATEST_END_HOUR = 18
EARLIEST_START_HOUR = 8

IN_PAST = 'Interview should not be in the past'
NOT_WORKING_HOUR = 'Interview time should be in the range of 8 - 18 (inclusive)'


def validate_working_hours(value):
    if not EARLIEST_START_HOUR <= value <= LATEST_END_HOUR:
        raise ValidationError(message=NOT_WORKING_HOUR)


def validate_not_past(value):
    if value < date.today():
        raise ValidationError(message=IN_PAST)
