from lark import Lark, Token, Tree
from lark.visitors import Interpreter
from lark import Discard
import json
import pymongo
import os

MONGODB_PORT = "50744"

grammar = r'''
//Regras Sintaticas
start: commands
commands: command+ order

command: slide description? code_block
    | nreactive
    | nfixed
    | variable // Commands created using nreactive or nfixed
    | comment
    
// COMANDO % texto de comentário
comment: "%" NOT_NL NL

NOT_NL: /[^\n]+/
NL: /\n/
    
// COMANDO \slide{VarsLoc}{Sobre as variáveis locais}
slide : "\\" SLIDE "{" ID "}" "{" TEXT "}"

// COMANDO \description{Aqui vai a descrição do slide}
description: "\\" DESCRIPTION "{" TEXT "}"

// COMANDO \begin codigo_a_demonstrar \end
code_block: "\\" BEGIN content "\\" END

content: (entry|code)+

entry: "\\" EXERCISE "{" REGEX "}" "{" TEXT "}"
    | "\\" NOT_END "{" content "}" "{" TEXT "}"
    | "\\" NOT_END "{" content "}"

NOT_END: /(?![eE][nN][dD])[a-zA-Z][a-zA-Z0-9_]+/

code: CODE
CODE: /(\\\\|\\\}|\\\{|[^\\\}\{]|\n)+/
    
// COMANDO \order{a,b,(c|d),e}
order: "\\" ORDER "{" exp "}"
exp: term
    | exp ("," term)
term: factor
    | term ("|" factor)
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

TXT_COLOR: "text\-color" | "color"
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
ALIGN: "left"
    | "right"
    | "center"
NUM: /[0-9]+/
TXT_SIZE: "text-size"
TXT_ALIGN: "text-align"
HEX: /\#[0-9a-fA-F]{6}/
    
NOTE: "nota" | "note"
SLIDE: "diapositivo" | "slide"
DESCRIPTION: "descricao" | "description"
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
        self.order_array = []
        self.order_ids = []

    def start(self,tree):
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
        self.visit_children(tree)
        if self.order_array == [] and self.order_ids == []:
            raise Exception("Order of the presentation was not defined.")
            
        # check if [k,b,c] in [a,c,d,b,e,w,f,t,g,k,y]
        non_existing_ids = [x for x in self.order_ids if x not in self.slides.keys()]
        if len(non_existing_ids) > 0:
            raise Exception("Unknown slide ids in the order command: "+str(non_existing_ids))

        return {'variables':self.cmds,'slides':self.slides,'order':self.order_array}

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
        #print(key,value)
        #print("REACTIVE COMMAND",key,"with style",value)
        self.cmds[key] = {"category":"command","type":"fixed","style":value}

    def mycss(self,tree):
        f = 0
        t = ""
        for e in tree.children:
            if e.type == "BOLD":
                t += "font-weight : bold"
            elif e.type == "ITALIC":
                t += "font-style : italic"
            elif e.type == "UNDERLINE":
                t += "text-decoration : underline"
            elif e.type == "STRIKETHROUGH":
                t += "text-decoration : line-through"
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
        r = []
        self.order_ids = []
        for t in tree.children:
            if type(t) == Tree:
                r.extend(self.visit(t))
        self.order_array = r
        
    def exp(self,tree):
        t = None
        is_seq = False
        for e in tree.children:
            if type(e) == Tree:
                if e.data == "term":
                    term = self.visit(e)
                    t = term[0]
                    is_fork = term[1]
                elif e.data == "exp":
                    is_seq = True
                    exp = self.visit(e)
        
        if is_fork:
            t = [t]
        if is_seq:
            exp.extend(t)
            return exp
        else:
            return t
                
    def term(self,tree):
        e = None
        is_fork = False
        for t in tree.children:
            if type(t) == Tree:
                if t.data == "factor":
                    term = self.visit(t)
                elif t.data == "term":
                    is_fork = True
                    e,is_f = self.visit(t)
        if is_fork:
            # return [[a],[b]]
            r = []
            r.append(e)
            r.append(term)
        else:
            r = term
        return [r,is_fork]

    def factor(self,tree):
        if type(tree.children[0]) == Tree:
            return self.visit(tree.children[0])
        elif tree.children[0].type == "ID":
            v = tree.children[0].value
            if v not in self.order_ids:
                self.order_ids.append(v)
            return [tree.children[0].value]
        else:
            print("Erro",tree.children[0])
        
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
        #print("variable",variable,id_,value)
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
        self.slides[self.current_slide]["description"] = ""

    # description: "\\" DESCRIPTION "{" TEXT "}"
    def description(self,tree):
        for e in tree.children:
            if e.type == "TEXT":
                self.slides[self.current_slide]["description"] = e.value
        
    # code_block: "\\" BEGIN content "\\" END
    def code_block(self,tree):
        for e in tree.children:
            if type(e) == Tree:
                if e.data == "content":
                    self.slides[self.current_slide]["code"] += self.visit(e).replace("\n","<br>")
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
                    self.current_content[-1] += self.visit(e).replace("\n","<br>")
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
        reg = reg[1:-1]
        self.slides[self.current_slide]["exercises"]["#"+str(i)] = {"regex":reg,"text":text}

        # add ex to html
        r = "<input type='text' class='exercise' regex='"+reg+"' title='#"+str(i)+"'>"
        r += "</input> "
        return r

    # "\\" NOT_END "{" content "}" "{" TEXT "}"
    def not_end(self,v,cont=None ,text=None):
        # if variable is either not defined or a command, create a new one
        if v not in self.cmds or self.cmds[v]["category"]=="command":
            # separator for local variables (slide#varNr)
            sep = "#"
            # number of local variables in this slide
            vs = sum([1 for k in self.cmds.keys() if k.startswith(self.current_slide+sep)])
            name = self.current_slide+sep+str(vs)
        else:
            name = v
        
        if text!=None:
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
                value = e.value.replace("\\\\","\\").replace("\\{","{").replace("\\}","}").replace("\n","<br>")
                self.current_content += value
                #print(self.current_content)
                return value

def handleSlides(slides,demoName,idDemo):
    newSlides = {
        "idDemo": idDemo,
        "demoName": demoName,
        "slides": []
    }
    for k in slides:
        slide = {
            'idSlide': k,
            'text': slides[k]['text'],
            'code': slides[k]['code'],
            'description': slides[k]['description'],
            'variables': slides[k]['variables']
            }
        exercises = []
        if 'exercises' in slides[k]:
            for e in slides[k]['exercises']:
                exercises.append({'idExercise': e,
                                  'regex': slides[k]['exercises'][e]['regex'],
                                  'text': slides[k]['exercises'][e]['text']})
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

def handleOrder(order,idDemo):
    newOrder = {
        "idDemo": idDemo,
        "order": str(order)
    }
    return newOrder

# Add the demo to the mongodb database
def addToDB(slides,variables,order):
    # get mongo path from environment variable
    mongo_path = os.getenv("MONGO_URI")
    if mongo_path:
        client = pymongo.MongoClient(mongo_path)
    else:
        # Connect to the database
        client = pymongo.MongoClient("mongodb://localhost:"+MONGODB_PORT+"/")
    # Get the database
    db = client["StepwiseSource"]
    # Get the Collections
    colDemos = db["demos"]
    colSlides = db["variables"]
    colOrders = db["orders"]

    with open("data_structure.json","w") as f:
        f.write(json.dumps([slides,variables,order], indent=4, sort_keys=True, ensure_ascii=False))
        f.close()

    try:
        # Define the filter to find a document with the matching idDemo
        filter = {"idDemo": slides['idDemo']}

        # Perform the upsert (update or insert if doesn't exist)
        colDemos.update_one(filter, {"$set": slides}, upsert=True)
        colSlides.update_one(filter, {"$set": variables}, upsert=True)
        colOrders.update_one(filter, {"$set": order}, upsert=True)

    except Exception as e:
        print(f"An error occurred: {e}")

    # Close the connection
    client.close()

def main(filename,demoName, idDemo=None):
    p = Lark(grammar)
    with open(filename, "r") as f:
        frase = f.read()
    tree = p.parse(frase)
    data = MyInterpreter().visit(tree)
    if not idDemo:
        idDemo = "DI"+str(abs(int(hash(frase))))
    print(idDemo)
    slides = handleSlides(data['slides'],demoName,idDemo)
    slides["demoText"] = frase
    variables = handleVariables(data['variables'],idDemo)
    order = handleOrder(data['order'],idDemo)

    # Add the demo to the mongodb database
    addToDB(slides,variables,order)

# When called from the terminal, get the first argument as the filename
if __name__ == "__main__":
    import sys
    if len(sys.argv) > 2:
        if len(sys.argv) > 3:
            pres_id = sys.argv[3]
        else:
            pres_id = None
        try:
            #     filename,    name,      id
            main(sys.argv[1],sys.argv[2],pres_id)
        except Exception as e:
            print(e)





