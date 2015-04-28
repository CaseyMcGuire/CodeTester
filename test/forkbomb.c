#include <stdio.h>
#include <unistd.h>

int main(void){
  int i = 1;
  for(;;i++){
    fork();
    printf("Forked %i children.\n", i);
  }
  return 0;
}
