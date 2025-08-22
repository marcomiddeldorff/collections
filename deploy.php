<?php
namespace Deployer;

require 'recipe/laravel.php';

// Config

set('repository', 'git@github.com:marcomiddeldorff/collections.git');

add('shared_dirs', ['storage']);
add('shared_files', ['.env']);

set('http_user', 'www-data');        // PHP-FPM-User
set('writable_dirs', [
    'storage',
    'storage/app/public',
    'bootstrap/cache',
    'storage/framework',
    'storage/logs',
]);
set('writable_mode', 'acl');         // oder 'chmod' als Fallback
set('writable_use_sudo', true);
// Hosts

host('collections.marco-middeldorff.de')
    ->set('remote_user', 'deployer')
    ->set('deploy_path', '~/Collections')
    ->set('ssh_multiplexing', false);

task('build:npm', function () {
    cd('{{release_path}}');
    run('npm install');
    run('npm run build');
});
// Hooks
after('deploy:update_code', 'build:npm');
after('deploy:failed', 'deploy:unlock');
