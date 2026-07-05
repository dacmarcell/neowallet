<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['deposit', 'transfer']);
            $table->decimal('amount', 15, 2);
            $table->foreignId('origin_account_id')->nullable()->constrained('accounts')->onDelete('cascade');
            $table->foreignId('destination_account_id')->nullable()->constrained('accounts')->onDelete('cascade');
            $table->boolean('reversed')->default(false);
            $table->timestamp('reversed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
