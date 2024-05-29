#include<stdio.h>
int func3(int num){
    printf("func3 %d\n",num);
    fflush(stdout);
    return 333;
}
int func1(int num){
    printf("func1\n");
    printf("func11 %d\n",num);
    fflush(stdout);
    func3(num+1);
    return 111;
}
int func2(int num){
    printf("func2 %d\n",num);
    fflush(stdout);
    func3(num+1);
    return 222;
}

int main(){
    int num=1;
    int num2=2;
    int num3=3;
    printf("111\n");
    printf("hello world %d\n",num3);
    fflush(stdout);
    func1(num);
    printf("hello 1\n");
    func2(num2);
    printf("hello 2\n");
    printf("hello 3\n");
    return 0;
}