CC=g++
OUTPUT=memes
CFLAGS=-fpermissive

build: hoi.cpp
	$(CC) *.cpp *.hpp -o $(OUTPUT) $(CFLAGS)

clean:
	rm -f ./*.exe