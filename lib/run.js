var runner = function(){


}

runner.PYTHON = function(){
    this.runCommand = 'python';
    this.fileExtension = '.py';
}

runner.RUBY = function(){
    this.runCommand = 'ruby';
    this.fileExtension = '.rb';
}

runner.JAVA = function(){
    this.runCommand = ['javac', 'java'];
    this.fileExtension = ['.java', '.class'];
}


if(require.main === module){

}


    


