angular.module('starter.controllers', ['ngCordova'])

//Pega a lista de contatos do banco
.controller("ContactListCtrl",function($scope,$cordovaSQLite,$ionicModal){
    var last = 0;
    //lista os registros do banco
    $scope.contacts ={};
    $scope.getlist = function(){
     
    var query = "SELECT * FROM contact";
    if(db!=null){

      $cordovaSQLite.execute(db,query,[]).then(function(res){
      
       if(last != res.rows.length){
        last = res.rows.length;
        $scope.noMoreItem = false;
       }else{
        $scope.noMoreItem = true;
       }

        if(res.rows.length > 0){
          var array =[];
          for(var i = 0;i<res.rows.length;i++){

              array.push(res.rows.item(i));
            
          }
          $scope.contacts = array;

        }
      },function(err){
        console.error(err);
      });
    }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    
  }
    //deleta o registro selecionado
    $scope.delete = function(id){
     var query = "DELETE FROM contact WHERE id = ?";
    $cordovaSQLite.execute(db,query,[id]);
    $scope.noMoreItem = false;
    }


    //cria o modal
    $ionicModal.fromTemplateUrl('templates/edit.html', {
        scope: $scope
        }).then(function(modal) {
       $scope.modal = modal;
       });

    

    //mostra o modal com os dados do registro
    $scope.editmodal = function(id){
      
      var query = "SELECT * from contact WHERE id = ?";
      $cordovaSQLite.execute(db,query,[id]).then(function(res){
        $scope.dev = res.rows.item(0);
     });

      $scope.modal.show();
    }

  //altera o registro selecionado
    $scope.edit = function(){

      var query = "UPDATE contact SET nickname =?,phone=?,github=? WHERE id = ?";
      $cordovaSQLite.execute(db,query,[$scope.dev.nickname,$scope.dev.phone,
        "https://api.github.com/users/" + $scope.dev.nickname,$scope.dev.id]).then(function(res){
         
           $scope.modal.hide();
        });
        $scope.noMoreItem = false;
    }
    $scope.close =function(){
        $scope.modal.hide();
    }
   
})

//adiciona contato ao banco
.controller("AddCtrl",function($scope,$cordovaSQLite){
  $scope.dataDev = {};
  $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS contact(id integer primary key,nickname text,phone text,github text)");
  
  $scope.insert = function(){
   
    var query = "INSERT INTO contact(nickname,phone,github) VALUES (?,?,?)";
    $cordovaSQLite.execute(db,query,[$scope.dataDev.nickname,$scope.dataDev.phone,"https://api.github.com/users/" + $scope.dataDev.nickname]).then(function(res){
     
    },function(err){
      console.error(err);
    });

  }
  
})

.controller('ContactCtrl',function($scope,$cordovaSQLite,$stateParams,$http){
  var query = "SELECT * from contact WHERE id = ?";
      $cordovaSQLite.execute(db,query,[$stateParams.contactId]).then(function(res){
        $scope.dev = res.rows.item(0);

      $http.get($scope.dev.github).then(function(res){
      $scope.name = res.data.name;
      $scope.img = res.data.avatar_url;
      $scope.email = res.data.email;

    },function(err){
      console.error(err);
    });
  });
});