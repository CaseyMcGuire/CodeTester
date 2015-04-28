#include <stdlib.h>
#include <stdio.h>
//source: David Malan
int main(void){
  
  int i = 1;
  for(;; i++){

    int *p = malloc(1 * 1024 * 1024);
    
    if(p == NULL){
      printf("Out of memory!");
      return 0;
    }

    *p = 50;//touch memory so it doesn't get optimized away

    printf("Allocated a total of %d MB. \n", i);
  }

  return 0;

}
