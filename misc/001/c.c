#include <stdio.h>
#include <stdlib.h>

#define FILENAME "./count-data.txt"

int get_count(void) {
    FILE *fp;
    const int buf_size = 16;
    char buf[buf_size];

    if ((fp = fopen(FILENAME, "r")) != NULL) {
        fgets(buf, buf_size, fp);
        fclose(fp);
        return atoi(buf) + 1;
    }
    return 1;
}

void update_count(int count) {
    FILE *fp;
    
    if ((fp = fopen(FILENAME, "w")) == NULL) {
        perror(FILENAME);
        exit(1);
    }
    fprintf(fp, "%d", count);
    fclose(fp);
}

void show_file(char *filename) {
    const int buf_size = 256;
    char command[buf_size], result[buf_size];
    size_t read_size;
    FILE *fp;
    
    if (snprintf(command, buf_size,
                 "sed 's/</\\&lt;/g;s/>/\\&gt;/g\' %s",
                 filename) == buf_size) {
        fprintf(stderr, "buffer overflow at %s\n",
                __FUNCTION__);
        exit(1);
    }
    if ((fp = popen(command, "r")) == NULL) {
        perror(command);
        exit(1);
    }
    while (read_size = fread(result, sizeof(char), buf_size, fp)) {
        fwrite(result, sizeof(char), read_size, stdout);
    }
    fclose(fp);
}

int main(int argc, char **argv) {
    int count;
    
    puts("Content-type: text/html\n\n<html><head>"
         "<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">"
         "</head><body><h1>CGI - C</h1>"
         "<h2>counter</h2>");
    count = get_count();
    printf("access count : %d\n", count);
    update_count(count);
    puts("<h2>code</h2><pre>");
    show_file(__FILE__);
    puts("</pre></body></html>");
    return 0;
}
