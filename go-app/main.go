package main

import (
	"encoding/xml"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/jaswdr/faker"
	"github.com/julienschmidt/httprouter"
)


type Customer struct {
  XMLName xml.Name `xml:"Customer"`
  Id string `xml:"Id"`
  FirstName string `xml:"FirstName"`
  LastName string `xml:"LastName"`
  Address string `xml:"Address"`
  Phone string `xml:"Phone"`
  CreatedAt string `xml:"CreatedAt"`
}

type Customers struct {
  XMLName xml.Name `xml:"Customers"`
  Customers []*Customer `xml:"Customer"`
}

var (
  Person faker.Person 
  Address faker.Address 
  Phone faker.Phone
  Time faker.Time
  Id faker.UUID
)

func (customer Customer) setInformation( ) Customer {
  customer.Id=Id.V4()
  customer.FirstName = Person.FirstName()
  customer.LastName = Person.LastName()
  customer.Address = Address.Address()
  customer.Phone = Phone.Number()
  customer.CreatedAt = Time.RFC3339Nano(time.Now())
  return customer;
}

func panicHandler(n httprouter.Handle) httprouter.Handle{
  return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params){
    defer func(){
      if err:= recover();err!=nil{
        w.WriteHeader(http.StatusInternalServerError);
        fmt.Println("panic averted",err)
        return;
      }
    }()
    n(w,r,ps)
  }
}

func main(){
  port, err := strconv.Atoi(os.Getenv("PORT"))
  if err!= nil{
    log.Fatal("Cannot parse PORT env")
  }

  faker := faker.New()
  Person = faker.Person()
  Address = faker.Address()
  Phone = faker.Phone()
  Time = faker.Time()
  Id = faker.UUID()

	router := httprouter.New()
  
	router.GET("/", panicHandler(func(w http.ResponseWriter, r *http.Request, _ httprouter.Params){

    users := &Customers{}
    users.Customers = []*Customer{}
    for i:=0; i< 40 ; i++ {
      customer := Customer{}.setInformation()
      users.Customers = append(users.Customers, &customer)
    }
    
    data,err := xml.MarshalIndent(&users," "," ");
    if err != nil{
      http.Error(w,err.Error(),http.StatusInternalServerError)
      return 
    }

    w.Header().Set("Content-Type", "application/xml")
    w.Write([]byte(xml.Header))
    w.Write(data)
  }))

	fmt.Printf("The  server is on tap now: http://localhost:%v\n",port);
	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(port), router))
}