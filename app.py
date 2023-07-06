from flask import Flask ,jsonify ,request
# del modulo flask importar la clase Flask y los métodos jsonify,request
from flask_cors import CORS       # del modulo flask_cors importar CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
app=Flask(__name__)  # crear el objeto app de la clase Flask
CORS(app) #modulo cors es para que me permita acceder desde el frontend al backend

# configuro la base de datos, con el nombre el usuario y la clave
# app.config['SQLALCHEMY_DATABASE_URI']='mysql+pymysql://user:password@localhost/proyecto'
app.config['SQLALCHEMY_DATABASE_URI']='mysql+pymysql://root:@localhost/paquete'
# URI de la BBDD                          driver de la BD  user:clave@URLBBDD/nombreBBDD
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False #none
db= SQLAlchemy(app)   #crea el objeto db de la clase SQLAlquemy
ma=Marshmallow(app)   #crea el objeto ma de de la clase Marshmallow


# defino la tabla
class Paquete(db.Model):   # la clase Paquete hereda de db.Model    
    id=db.Column(db.Integer, primary_key=True)   #define los campos de la tabla
    nombre=db.Column(db.String(100))
    precio=db.Column(db.Integer)
    cupos=db.Column(db.Integer)
    imagen=db.Column(db.String(400))
    def __init__(self,nombre,precio,cupos,imagen):   #crea el  constructor de la clase
        self.nombre=nombre   # no hace falta el id porque lo crea sola mysql por ser auto_incremento
        self.precio=precio
        self.cupos=cupos
        self.imagen=imagen




    #  si hay que crear mas tablas , se hace aqui




with app.app_context():
    db.create_all()  # aqui crea todas las tablas
#  ************************************************************
class PaqueteSchema(ma.Schema):
    class Meta:
        fields=('id','nombre','precio','cupos','imagen')




paquete_schema=PaqueteSchema()            # El objeto paquete_schema es para traer un paquete
paquetes_schema=PaqueteSchema(many=True)  # El objeto paquetes_schema es para traer multiples registros de paquete


# crea los endpoint o rutas (json)
@app.route('/paquetes',methods=['GET'])
def get_Paquetes():
    all_paquetes=Paquete.query.all()         # el metodo query.all() lo hereda de db.Model
    result=paquetes_schema.dump(all_paquetes)  # el metodo dump() lo hereda de ma.schema y
                                                 # trae todos los registros de la tabla
    return jsonify(result)                       # retorna un JSON de todos los registros de la tabla




@app.route('/paquetes/<id>',methods=['GET'])
def get_paquete(id):
    paquete=Paquete.query.get(id)
    return paquete_schema.jsonify(paquete)   # retorna el JSON de un paquete recibido como parametro




@app.route('/paquetes/<id>',methods=['DELETE'])
def delete_paquete(id):
    paquete=Paquete.query.get(id)
    db.session.delete(paquete)
    db.session.commit()
    return paquete_schema.jsonify(paquete)   # me devuelve un json con el registro eliminado


@app.route('/paquetes', methods=['POST']) # crea ruta o endpoint
def create_paquete():
    #print(request.json)  # request.json contiene el json que envio el cliente
    nombre=request.json['nombre']
    precio=request.json['precio']
    cupos=request.json['cupos']
    imagen=request.json['imagen']
    new_paquete=Paquete(nombre,precio,cupos,imagen)
    db.session.add(new_paquete)
    db.session.commit()
    return paquete_schema.jsonify(new_paquete)


@app.route('/paquetes/<id>' ,methods=['PUT'])
def update_paquete(id):
    paquete=Paquete.query.get(id)
 
    paquete.nombre=request.json['nombre']
    paquete.precio=request.json['precio']
    paquete.cupos=request.json['cupos']
    paquete.imagen=request.json['imagen']


    db.session.commit()
    return paquete_schema.jsonify(paquete)
 


# programa principal *******************************
if __name__=='__main__':  
    app.run(debug=True, port=5000)    # ejecuta el servidor Flask en el puerto 5000