#include<stdio.h>
#include<string.h>

#define true 1
#define false 0

int main() {
    char memes[10];
    fgets(memes, 10, stdin);
    strcat(memes, "\7");
    strcat(memes, "??<");
    puts(memes);
    return 0;
}