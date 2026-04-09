<?php 
require 'vendor/autoload.php'; 
$app = require_once 'bootstrap/app.php'; 
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class); 
$kernel->bootstrap(); 
$req = Illuminate\Http\Request::create('/api/v1/ai/generate-template', 'POST', ['contact_id' => 1, 'difficulty' => 'facile', 'context' => 'test']); 
$ctrl = new App\Http\Controllers\Api\AIController(); 
try { 
    $res = $ctrl->generatePhishingEmail($req); 
    print_r($res->getContent()); 
} catch (\Exception $e) { 
    echo 'BINGO: ' . $e->getMessage(); 
}
