em++ simple_c.cpp -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_RUNTIME_METHODS=ccall,cwrap,setValue,getValue -s ASYNCIFY=1 -I../inc ../lib/w32/fmod_wasm.a -o simple_c.html
