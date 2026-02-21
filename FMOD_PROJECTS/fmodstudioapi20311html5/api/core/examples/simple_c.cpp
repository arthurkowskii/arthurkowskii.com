/*==============================================================================
Simple C Example
Copyright (c), Firelight Technologies Pty, Ltd 2004-2025.

This example uses System::playDSP to produce a tone.  It exists to provide an 
example of linking and build options using the W32 libraries rather than 
developing with Javascript directly.

For information on using FMOD example code in your own programs, visit
https://www.fmod.com/legal
==============================================================================*/

#include <emscripten.h>
#include <stdio.h>

#include "fmod.hpp"
#include "fmod_errors.h"

void ERRCHECK_fn(FMOD_RESULT result, const char *file, int line)
{
    if (result != FMOD_OK)
    {
        printf("%s(%d): FMOD error %d - %s\n", file, line, result, FMOD_ErrorString(result));
    }
}

#define ERRCHECK(_result) { ERRCHECK_fn(_result, __FILE__, __LINE__); if (result != FMOD_OK) return 0; }

int main()
{
    FMOD::System     *system;
    FMOD::DSP        *dsp;
    FMOD::Channel    *channel = 0;
    FMOD_RESULT       result;

    // Optional.  Set the window handle for FMOD internally.
    EM_ASM({
        console.log("Setting FMOD module window handle");
        Module.window = window;
    });

    /*
        Create a System object and initialize
    */
    result = FMOD::System_Create(&system);
    ERRCHECK(result);

    // Optional.  Setting DSP Buffer size can affect latency and stability.  Older browsers may require larger buffer sizes than default.
    result = system->setDSPBufferSize(2048, 2);
    ERRCHECK(result);

    result = system->init(32, FMOD_INIT_NORMAL, 0);
    ERRCHECK(result);

    result = system->createDSPByType(FMOD_DSP_TYPE_OSCILLATOR, &dsp);
    ERRCHECK(result);

    result = system->playDSP(dsp, 0, false, &channel);
    ERRCHECK(result);

    /*
        Main loop
    */
    do
    {
        result = system->update();
        ERRCHECK(result);

        {
            unsigned int ms = 0;
            bool         playing = 0;
            bool         paused = 0;
            int          channelsplaying = 0;

            if (channel)
            {
                result = channel->isPlaying(&playing);
                if ((result != FMOD_OK) && (result != FMOD_ERR_INVALID_HANDLE) && (result != FMOD_ERR_CHANNEL_STOLEN))
                {
                    ERRCHECK(result);
                }

                result = channel->getPaused(&paused);
                if ((result != FMOD_OK) && (result != FMOD_ERR_INVALID_HANDLE) && (result != FMOD_ERR_CHANNEL_STOLEN))
                {
                    ERRCHECK(result);
                }

                result = channel->getPosition(&ms, FMOD_TIMEUNIT_MS);
                if ((result != FMOD_OK) && (result != FMOD_ERR_INVALID_HANDLE) && (result != FMOD_ERR_CHANNEL_STOLEN))
                {
                    ERRCHECK(result);
                }              
            }

            system->getChannelsPlaying(&channelsplaying, nullptr);

            printf("Time %02d:%02d:%02d : %s. Channels playing %d\n", ms / 1000 / 60, ms / 1000 % 60, ms / 10 % 100, paused ? "Paused " : playing ? "Playing" : "Stopped", channelsplaying);
        }

       emscripten_sleep(50);

    } while (1);

    /*
        Shut down
    */
    result = dsp->release();
    ERRCHECK(result);
    result = system->close();
    ERRCHECK(result);
    result = system->release();
    ERRCHECK(result);

    return 0;
}
