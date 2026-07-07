FROM php:8.4-cli-alpine

RUN apk add --no-cache \
        bash \
        curl \
        libpng-dev \
        libzip-dev \
        zip \
        unzip \
        postgresql-dev \
        oniguruma-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring zip bcmath

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist

COPY . .

RUN composer dump-autoload --optimize \
    && chown -R www-data:www-data storage bootstrap/cache

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000
CMD ["/usr/local/bin/entrypoint.sh"]