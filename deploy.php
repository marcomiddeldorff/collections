<?php
namespace Deployer;

require 'recipe/laravel.php';

// Config

set('repository', 'git@github.com:marcomiddeldorff/collections.git');

add('shared_files', []);
add('shared_dirs', []);
add('writable_dirs', []);

// Hosts

host('collections.marco-middeldorff.de')
    ->set('remote_user', 'deployer')
    ->set('deploy_path', '~/Collections')
    ->set('ssh_multiplexing', false);

// ZcNEOg@eRWdFi8mOl8B$K@AY@D6oPHeAFBt&yoOSQJ*LRRanmA
// Hooks

after('deploy:failed', 'deploy:unlock');
