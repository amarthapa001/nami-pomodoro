from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='profile_image_url',
            field=models.CharField(blank=True, default='', max_length=500),
        ),
    ]
