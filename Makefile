CC=g++
OUTPUT=memes
CFLAGS=-fpermissive

build: this-is-a-file.cpp
	$(CC) *.cpp *.hpp -o $(OUTPUT) $(CFLAGS)

clean:
	rm -f ./*.exe