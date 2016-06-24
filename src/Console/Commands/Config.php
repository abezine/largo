<?php

namespace Dias\Modules\Ate\Console\Commands;

use Illuminate\Console\Command;
use Dias\Modules\Ate\AteServiceProvider as ServiceProvider;

class Config extends Command {

    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'ate:config';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Publish the config file for this module';

    /**
     * Execute the command.
     *
     * @return void
     */
    public function handle()
    {
        $this->call('vendor:publish', [
            '--provider' => ServiceProvider::class,
            '--tag' => ['config'],
            '--force' => true,
        ]);
    }
}
