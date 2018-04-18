
var Contacts = {
  index: window.localStorage.getItem("Contacts:index"),
  $table: document.getElementById("contacts-name"),
  $form: document.getElementById("contacts-form"),
  $button_save: document.getElementById("contacts-save"),
  $button_cancel: document.getElementById("contacts-cancel"),

  init: function() {

    // initialize storage index

    if (!Contacts.index) {
      window.localStorage.setItem("Contacts:index", Contacts.index = 1);
    }

    // initialize form

    Contacts.$form.reset();
    Contacts.$button_cancel.addEventListener("click", function(event) {

      Contacts.$form.reset();
      Contacts.$form.id_entry.value = 0;
    }, true);

    Contacts.$form.addEventListener("submit", function(event) {
      var entry = {

        id: parseInt(this.id_entry.value),
        first_name: this.first_name.value,
        last_name: this.last_name.value,
        email: this.email.value,
        phone: this.phone.value,
        bday: this.bday.value
      };

      if (entry.id == 0) { // add

         Contacts.storeAdd(entry);
        Contacts.tableAdd(entry);
      }
      else { // edit

        Contacts.storeEdit(entry);
        Contacts.tableEdit(entry);
       }


      this.reset();
      this.id_entry.value = 0;
       event.preventDefault();

    }, true);


    // initialize table

    if (window.localStorage.length - 1) {

      var contacts_list = [], i, key;

      for (i = 0; i < window.localStorage.length; i++) {

         key = window.localStorage.key(i);
        if (/Contacts:\d+/.test(key)) {
          contacts_list.push(JSON.parse(window.localStorage.getItem(key)));
        }
      }

      if (contacts_list.length) {

        contacts_list.sort(function(a, b) {
            return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
          }).forEach(Contacts.tableAdd);
      }
    }

    // editing and deleting contact
    Contacts.$table.addEventListener("click", function(event) {

      var op = event.target.getAttribute("data-op");

      if (/edit|remove/.test(op)) {

        var entry = JSON.parse(window.localStorage.getItem("Contacts:"+ event.target.getAttribute("data-id")));

        if (op == "edit") {

          Contacts.$form.first_name.value = entry.first_name;
          Contacts.$form.last_name.value = entry.last_name;
          Contacts.$form.email.value = entry.email;
          Contacts.$form.phone.value = entry.phone;
          Contacts.$form.bday.value = entry.bday;
          Contacts.$form.id_entry.value = entry.id;

        }
        else if (op == "remove") {

          if (confirm('Are you sure you want to remove "'+ entry.first_name +' '+ entry.last_name +'" from your contacts?')) {

            Contacts.storeRemove(entry);
            Contacts.tableRemove(entry);
          }
        }
        event.preventDefault();
      }
    }, true);
  },

  
  // adding new contact to the local storage
  storeAdd: function(entry) {

    entry.id = Contacts.index;
    window.localStorage.setItem("Contacts:index", ++Contacts.index);
    window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
  },

  // editing existing contact in the local storage
  storeEdit: function(entry) {

    window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
  },


  //deleting existing contact from the local storage
  storeRemove: function(entry) {

    window.localStorage.removeItem("Contacts:"+ entry.id);
  },


  // adding new contact to the table
  tableAdd: function(entry) {
    var $tr = document.createElement("tr"), $td, key;


    // for statment to add/display only contact names with id on the table

    for(i=0; i<1; i++){

     $td = document.createElement("td");
      $td.appendChild(document.createTextNode(entry['id']));
      $tr.appendChild($td);

      $td = document.createElement("td");
      $td.appendChild(document.createTextNode(entry['first_name']));
      $tr.appendChild($td);
    }


    $td = document.createElement("td");
    $td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Delete</a>';
    $tr.appendChild($td);
    $tr.setAttribute("id", "entry-"+ entry.id);

    Contacts.$table.appendChild($tr);
  },


  //editing existing contact on the contact table
  tableEdit: function(entry) {

    var $tr = document.getElementById("entry-"+ entry.id), $td, key;

    $tr.innerHTML = "";

    for (key in entry) {

      if (entry.hasOwnProperty(key)) {

        $td = document.createElement("td");
        $td.appendChild(document.createTextNode(entry[key]));
        $tr.appendChild($td);
      }
    }


    $td = document.createElement("td");

    $td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Delete</a>';
    $tr.appendChild($td);
  },


  //deleting existing contact from the table
  tableRemove: function(entry) {
    
    Contacts.$table.removeChild(document.getElementById("entry-"+ entry.id));
  }
};

Contacts.init();

//display a contact details when clicked on the name
$(document).ready(function() {

  $('table tr').click(function() {

    current = $('table tr').index($(this))-1;
    var details=[];

    details.push(JSON.parse(window.localStorage.getItem(key)));


    if (window.localStorage.length - 1) {

      var contacts_list = [], i, key;

      for (i = 0; i < window.localStorage.length; i++) {

        key = window.localStorage.key(i);

        if (/Contacts:\d+/.test(key)) {

          contacts_list.push(JSON.parse(window.localStorage.getItem(key)));
        }

      }

    }

      if (contacts_list.length) {

        contacts_list.sort(function(a, b) {

            return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);

          });
      }

    var first_name=contacts_list[current]['first_name'];
    var last_name=contacts_list[current]['last_name'];
    var email=contacts_list[current]['email'];
    var phone=contacts_list[current]['phone'];
    var bday=contacts_list[current]['bday'];

    $('#details #name').text(first_name+"'s"+ " details");

    $('#details #table').html(
      "<tr> <th>First Name</th> <th>Last Name</th> <th>Email</th> <th>Phone Number</th> <th>Birthday</th></tr>"+
      +"<tr>"+
        "<td>"+ first_name+"</td>"+
        "<td>"+ last_name+"</td>"+
        "<td>"+ email+"</td>"+
        "<td>"+ phone+"</td>"+
        "<td>"+ bday+"</td>"
      +"</tr>"
    );

  });

});