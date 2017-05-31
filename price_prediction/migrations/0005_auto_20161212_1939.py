# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('price_prediction', '0004_auto_20161122_1526'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fittedvaluesbycategory',
            name='fittedvalue',
            field=models.DecimalField(decimal_places=2, max_digits=200),
        ),
    ]
