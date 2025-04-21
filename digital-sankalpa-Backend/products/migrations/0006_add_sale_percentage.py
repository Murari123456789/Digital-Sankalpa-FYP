from django.db import migrations, models
from django.core.validators import MinValueValidator, MaxValueValidator

class Migration(migrations.Migration):

    dependencies = [
        ('products', '0005_alter_wishlist_options_alter_wishlist_user_review'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='sale_percentage',
            field=models.DecimalField(
                max_digits=5,
                decimal_places=2,
                default=0,
                validators=[MinValueValidator(0), MaxValueValidator(100)]
            ),
        ),
    ] 