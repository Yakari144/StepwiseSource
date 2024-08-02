from lark import Lark, Token, Tree
from lark.visitors import Interpreter
from lark import Discard
import json
import pymongo

MONGODB_PORT = "50744"

grammar = r'''
//Regras Sintaticas
start: commands
commands: command+

command: slide code_block
    | nreactive
    | nfixed
    | order
    | variable // Commands created using nreactive or nfixed
    
// COMANDO \slide{VarsLoc}{Sobre as variáveis locais}
slide : "\\" SLIDE "{" ID "}" "{" TEXT "}"

// COMANDO \begin codigo_a_demonstrar \end
code_block: "\\" BEGIN content "\\" END

content: (entry|code)+

entry: "\\" EXERCISE "{" REGEX "}" "{" TEXT "}"
    | "\\" NOT_END "{" content "}" "{" TEXT "}"
    | "\\" NOT_END "{" content "}"

NOT_END: /(?![eE][nN][dD])[a-zA-Z][a-zA-Z0-9_]+/

code: CODE
CODE: /(\\\\|\\\}|[^\\\}\{])+/
    
// COMANDO \order{a,b,(c|d),e}
order: "\\" ORDER "{" exp "}"
exp: term
    | exp ("|" term)
term: factor
    | term ("," factor)
factor: ID
    | "(" exp ")"

// COMANDO \newreactive{VarsLoc}{text-color = red; color = blue; ...}
nreactive: "\\" NEWREACTIVE "{" ID "}" "{" mycss (";" mycss)* "}"

// COMANDO \newfixed{VarsLoc}{text-color = red; color = blue; ...}
nfixed: "\\" NEWFIXED "{" ID "}" "{" mycss (";" mycss)* "}"

// COMANDO \var{Args}{Argumentos são variáveis ....}
variable: "\\" VARIABLE "{" ID "}" "{" TEXT "}"

mycss: TXT_COLOR ":" COLOR
    | BG_COLOR ":" COLOR
    | BORDER_COLOR ":" COLOR
    | BOLD
    | ITALIC
    | UNDERLINE
    | STRIKETHROUGH
    | TXT_SIZE ":" NUM
    | TXT_ALIGN ":" ALIGN
    | TXT_STYLE ":" STYLE               // ??

TXT_COLOR: "color"
BG_COLOR: "background-color"
BORDER_COLOR: "border-color"
BOLD: "bold"
ITALIC: "italic"
UNDERLINE: "underline"
STRIKETHROUGH: "strikethrough"
COLOR: "red"
    | "green"
    | "blue"
    | "yellow"
    | "black"
    | "white"
    | "purple"
    | "orange"
    | "pink"
    | "brown"
    | "grey"
    | "cyan"
    | "magenta"
    | "lime"
    | HEX
STYLE: "normal"
    | "italic"
    | "oblique"
ALIGN: "left"
    | "right"
    | "center"
NUM: /[0-9]+/
TXT_SIZE: "text-size"
TXT_STYLE: "text-style"
TXT_ALIGN: "text-align"
HEX: /\#[0-9a-fA-F]{6}/
    

NOTE: "nota" | "note"
SLIDE: "diapositivo" | "slide"
BEGIN: "inicio" | "begin"
END: "fim" | "end"
HIGHLIGHT: "destaque" | "highlight"
EXERCISE: "exercicio" | "exercise"
ORDER: "ordem" | "order"
NEWREACTIVE: "novoreativo" | "newreactive"
NEWFIXED: "novofixo" | "newfixed"



//Regras Lexicográficas
ID: ("a".."z"|"A".."Z")("a".."z"|"A".."Z"|"_"|"0".."9")*
VARIABLE: /(?!"newreactive"|"newfixed"|"novoreativo"|"novofixo")[a-z_A-Z][a-zA-Z_0-9]*/

TEXT: /((\\\})|([^}]))+/

REGEX: /\/(\\\/|[^\/])+\//

//string: DOUBLE_S
//    | SINGLE_S
//DOUBLE_S: /\"(\\\\|(\\\")|[^\"])+\"/ 
//SINGE_S: /\'(\\\\|(\\\')|[^\'])+\'/

//Tratamento dos espaços em branco
%import common.WS
%ignore WS
'''

class MyInterpreter(Interpreter):
    def __init__(self):
        self.cmds = {}
        self.graph = "digraph G {\n"
        self.slides = {}
        self.current_slide = ""
        self.current_content = []

    def start(self,tree):
        self.visit_children(tree)
        # pretty print datastructures
        #with open("out/variables.json","w") as f:
        #    f.write(json.dumps(self.cmds, indent=4, sort_keys=True, ensure_ascii=False))
        #    f.close()
        #with open("out/slides.json","w") as f:
        #    f.write(json.dumps(self.slides, indent=4, sort_keys=True, ensure_ascii=False))
        #    f.close()
        #with open("out/a.html","w") as f:
        #    init = f"""<!DOCTYPE html>
        #    <html>
        #    <head>
        #        <link rel="stylesheet" type="text/css" href="a.css">
        #    </head>
        #    <body><pre>"""
        #    f.write(init)
        #    for k in self.slides:
        #        f.write(self.slides[k]["code"])
        #    f.write("</pre></body></html>")
        #    f.close()
        #with open("out/a.css","w") as f:
        #    for k in self.cmds:
        #        if self.cmds[k]["category"] == "command":
        #            f.write("."+k+"{\n")
        #            for s in self.cmds[k]["style"]:
        #                f.write(s+";\n")
        #            f.write("}\n")
        #    f.close()

        return {'variables':self.cmds,'slides':self.slides}

    # commands: command+
    def commands(self,tree):
        self.visit_children(tree)
    
    # command: slide | nreactive | nfixed | code_block | highlight | note | order | variable 
    def command(self,tree):
        self.visit_children(tree)

    # nreactive: "\\" NEWREACTIVE "{" ID "}" "{" mycss (";" mycss)* "}"
    def nreactive(self,tree):
        key = ""
        value = []
        for e in tree.children:
            if type(e) == Tree:
                if e.data == "mycss":
                    value.append(self.visit(e))
            else:
                if e.type == "ID":
                    key = e.value
        self.cmds[key] = {"category":"command","type":"reactive","style":value}
    
    # nfixed: "\\" NEWFIXED "{" ID "}" "{" mycss (";" mycss)* "}"
    def nfixed(self,tree):
        key = ""
        value = []
        for e in tree.children:
            if type(e) == Tree:
                if e.data == "mycss":
                    value.append(self.visit(e))
            else:
                if e.type == "ID":
                    key = e.value
        self.cmds[key] = {"category":"command","type":"fixed","style":value}

    def mycss(self,tree):
        f = 0
        t = ""
        for e in tree.children:
            if e.type == "BOLD":
                t += "font-weight:bold"
            elif e.type == "ITALIC":
                t += "font-style:italic"
            elif e.type == "UNDERLINE":
                t += "text-decoration:underline"
            elif e.type == "STRIKETHROUGH":
                t += "text-decoration:line-through"
            else:
                if not f:
                    t += e.value
                    f = 1
                else:
                    t += " : "+e.value
        return t

    # order: "\\" ORDER "{" exp "}"
    def order(self,tree):
        # print tree of type Tree
        self.visit_children(tree)
        #with open("out/graph/"+str(hash(self.graph))+".dot","w") as f:
        #    f.write(self.graph+"}")
        self.graph = "digraph G {\n"

    def exp(self,tree):
        e = None
        for t in tree.children:
            if type(t) == Tree:
                if t.data == "term":
                    t = self.visit(t)
                elif t.data == "exp":
                    e = self.visit(t)
        # return concatenation of lists "e" and "t"
        if not e:
            return t
        else:
            return [e[0]+t[0],e[1]+t[1]]
                
    def term(self,tree):
        t = None
        for e in tree.children:
            if type(e) == Tree:
                if e.data == "factor":
                    f = self.visit(e)
                elif e.data == "term":
                    t = self.visit(e)
        if t:
            for e in t[1]:
                for i in f[0]:
                    self.graph+= e+" -> "+i+"\n"
            return [t[0],f[1]]
        else:
            return f

    def factor(self,tree):
        if type(tree.children[0]) == Tree:
            return self.visit(tree.children[0])
        elif tree.children[0].type == "ID":
            return [[tree.children[0].value],[tree.children[0].value]]
        
    # variable: "\\" VARIABLE "{" ID "}" "{" TEXT "}"
    def variable(self,tree):
        value = ""
        for e in tree.children:
            if e.type == "VARIABLE":
                variable = e.value
            elif e.type == "ID":
                id_ = e.value
            else:
                value = e.value
        if id_ in self.cmds:
            #print("Variável "+id_+"já existe!")
            pass
        self.cmds[id_] = {"category":"variable","command":variable,"text":value}

    # slide : "\\" SLIDE "{" ID "}" "{" TEXT "}"
    def slide(self,tree):
        for e in tree.children:
            if e.type == "ID":
                k = e.value
                if k not in self.slides:
                    self.slides[k] = {}
                else:
                    #print("Slide já existe")
                    pass
            elif e.type == "TEXT":
                self.slides[k]["text"] = e.value
        self.current_slide = k
        self.slides[self.current_slide]["code"] = "<span class='code' id='"+k+"'>"
        self.slides[self.current_slide]["variables"] = []

    # code_block: "\\" BEGIN content "\\" END
    def code_block(self,tree):
        for e in tree.children:
            if type(e) == Tree:
                if e.data == "content":
                    self.slides[self.current_slide]["code"] += self.visit(e)
        self.slides[self.current_slide]["code"] += "</span>"
        self.current_slide = ""

    # content: (entry|code)+
    def content(self,tree):
        #print(self.visit_children(tree))
        self.current_content.append("")
        for e in tree.children:
            if type(e) == Tree:
                if e.data == "entry":
                    self.current_content[-1] += self.visit(e)
                elif e.data == "code":
                    self.current_content[-1] += self.visit(e)
        current_content = self.current_content.pop()
        return current_content

    def entry(self,tree):
        f = ""
        e1 = None
        e2 = None
        for e in tree.children:
            if type(e) == Tree:
                if e.data == "content":
                    e1 = self.visit(e)
            else:
                if e.type == "EXERCISE":
                    f = 0
                elif e.type == "NOT_END":
                    f = e.value
                elif e.type == "REGEX":
                    e1 = e.value
                elif e.type == "TEXT":
                    e2 = e.value
        if f==0:
            return self.exercise(e1,e2)
        else:
            return self.not_end(f,e1,e2)
            
    # "\\" EXERCISE "{" REGEX "}" "{" TEXT "}"
    def exercise(self,reg,text):
        # first ex in this slide
        if "exercises" not in self.slides[self.current_slide]:
            self.slides[self.current_slide]["exercises"] = {}
        # add ex to slide
        i = len(self.slides[self.current_slide]["exercises"])
        self.slides[self.current_slide]["exercises"]["#"+str(i)] = {"regex":reg,"text":text}

        # add ex to html
        r = "<span class='exercise' reg='"+reg+"' id='#"+str(i)+"'>"
        r += "CRIAR CAIXA DE INPUT AQUI"
        r += "</span>"
        return r

    # "\\" NOT_END "{" content "}" "{" TEXT "}"
    def not_end(self,v,cont,text):
        # if variable is either not defined or a command, create a new one
        if v not in self.cmds or self.cmds[v]["category"]=="command":
            # separator for local variables (slide#varNr)
            sep = "#"
            # number of local variables in this slide
            vs = sum([1 for k in self.cmds.keys() if k.startswith(self.current_slide+sep)])
            name = self.current_slide+sep+str(vs)
        else:
            name = v
        
        if text:
            if name in self.cmds:
                #print("Variável LOCAL "+name+"já existe!")
                pass
            self.cmds[name] = {"category":"variable","command":v,"text":text}
        if cont!=None:
            self.slides[self.current_slide]["variables"].append(name)
            return "<span command='"+name+"' class='"+self.cmds[name]['command']+"'>"+cont+"</span>"
        # avaliar o uso de :
        #   -> \highlight{codigo} (sem texto) 
        #   -> \NomeVar{codigo}{texto} 

    def code(self,tree):
        for e in tree.children:
            if e.type == "CODE":
                # convert every \\ to \
                self.current_content += e.value#.replace("\\\\","\\")
                #print(self.current_content)
                return e.value


def handleSlides(slides,idDemo):
    newSlides = {
        "idDemo": idDemo,
        "slides": []
    }
    for k in slides:
        slide = {'idSlide': k, 'text': slides[k]['text'], 'code': slides[k]['code'], 'variables': slides[k]['variables']}
        exercises = []
        if 'exercises' in slides[k]:
            for e in slides[k]['exercises']:
                exercises.append({'idExercise': e, 'regex': slides[k]['exercises'][e]['regex'], 'text': slides[k]['exercises'][e]['text']})
            slide['exercises'] = exercises
        newSlides['slides'].append(slide)

    return newSlides


def handleVariables(variables,idDemo):
    newVariables = {
        "idDemo": idDemo,
        "variables": []
    }
    for k in variables:
        atrs = variables[k].keys()
        variable = {'idVariable': k}
        for a in atrs:
            variable[a] = variables[k][a]
        newVariables['variables'].append(variable)
    return newVariables

# Add the demo to the mongodb database
def addToDB(slides,variables):
    # Connect to the database
    client = pymongo.MongoClient("mongodb://localhost:"+MONGODB_PORT+"/")
    # Get the database
    db = client["StepwiseSource"]
    # Get the Collections
    colDemos = db["demos"]
    colSlides = db["variables"]

    # Add the demo to the database
    colDemos.insert_one(slides)
    colSlides.insert_one(variables)

    #print("Demo added to the database")

    # Close the connection
    client.close()

def main(filename):
    p = Lark(grammar)
    with open(filename, "r") as f:
        frase = f.read()
    tree = p.parse(frase)
    data = MyInterpreter().visit(tree)
    idDemo = str(abs(int(hash(frase))))
    print(idDemo)
    slides = handleSlides(data['slides'],idDemo)
    variables = handleVariables(data['variables'],idDemo)

    # Add the demo to the mongodb database
    addToDB(slides,variables)

# When called from the terminal, get the first argument as the filename
if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        main(sys.argv[1])






