/**********************************   EXAMPLE ******************************************
var budgetController = (function() {
    var x = 23;
    var add = function(a){
        return x + a;
        
    }
    return{
        publicTest: function(b){
            return(add(b));
        }
        
    }
})();

var UIConroller = (function() {
    
    // Some code
})();

var controller = (function(budgetCtrl, UICtrl){
    
    var z = budgetCtrl.publicTest(5);
    
    return {
        anotherPublic: function(){
            console.log(z);
        }
    }
})(budgetController , UIConroller);       */






/****************************** ACTUAL PROJECT *********************************/

// BUDGE CONTROLLER
var budgetController = (function() {
    
    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    
    Expense.prototype.calcPercentage = function(totalIncome) {
        
        if(totalIncome > 0){
            
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function(){
        
        return this.percentage;
    };
    
    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type){
      
        var sum = 0;
        data.allItems[type].forEach(function(cur){
           
            sum = sum + cur.value;
        });
        
        data.totals[type] = sum;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        
        budget: 0,
        
        percentage:-1
    };
    
    return {
        addItem: function(type , des , val){
            var newItem,ID;
            
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8],next ID = 9
            // ID = last ID + 1
            
            // create new ID
            
            if(data.allItems[type].length > 0)
                {
                    ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                    
                }
            else{
                ID = 0;
            }
            
            //create new Item based on 'inc' or 'exp' typr
            
            if(type === 'exp'){
                newItem = new Expense(ID,des,val);
            }
            else if (type === 'inc')
                {
                    newItem = new Income(ID,des,val);
                }
            // push it into our data Structure
            
            data.allItems[type].push(newItem);
            
            // Return the new Element
            return newItem;
        },
        
        deleteItem: function(type,id) {
            var ids, index;
            
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4 6 8]
            //index = 3
            
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            
            index = ids.indexOf(id);
            
            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
        },
        
        calculateBudget: function(){
            
            //1. calculate total income and expenses 
            
            calculateTotal('exp');
calculateTotal('inc');
            
            // calculate the budget : income - expenses
            
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                
                 data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else{
                data.percentage = -1;
            }
           
        },
        
        
        
         calculatePercentages: function() {
            
            data.allItems.exp.forEach(function(cur){
                
                cur.calcPercentage(data.totals.inc);
            });
        },
        
        getPercentages: function() {
            
            var allPerc = data.allItems.exp.map(function(cur){
               
                return cur.getPercentage();
            });
            
            
            return allPerc;
            
        },
        
        getBudget: function() {
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
                
            };
            
        },
        
        
       
        
        
        testing: function(){
            console.log(data);
        }
    }
   
})();




// UI CONTROLLER

var UIConroller = (function() {
    
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        bugetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
     var formatNumber =  function(num, type){
        
        var numSplit, int, dec , type;
      
        /*
        
        add + or - before number
        exactly 2 decimal points
        comma separating the thousands
        
        2310.4567 -> + 2,310.46
        2000 -> + 2,000.00
            */
        
        num = Math.abs(num);
        num = num.toFixed(2);
        
        numSplit = num.split('.');
        
        int = numSplit[0];
        
        if(int.length > 3) {
            
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3 , 3);
            
        }
        
        dec = numSplit[1];
        
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
        
    };
  
    return {
        getInput: function(){
            return{
             type: document.querySelector(DOMStrings.inputType).value,
             description: document.querySelector(DOMStrings.inputDescription).value,
             value: parseFloat(document.querySelector(DOMStrings.inputValue).value)

            };
        },
        
        addListItem: function(obj, type){
            var html, newHtml , element;
            // create HTML string with placeholder text
            
            if(type === 'inc'){
                
                element = DOMStrings.incomeContainer;
                
              html =  '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            }
            
            
            else if(type === 'exp'){
                
                element = DOMStrings.expensesContainer;
                
             html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
                }
            // Replace the placeholder text with some actual data
            
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value , type));
            
            
            // INSERT THE HTML INTO THE DOM
            
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },
        
        deleteListItem: function(selectorID){
            
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
            
                },
        
        clearFields: function() {
            var fields , fieldsArr;
            
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current,index,array) {
                
               // current.description = "";
                current.value = "";
                
            });
        },
        
        displayBudget: function(obj) {
            
            var type;
            
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMStrings.bugetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');
            
            if(obj.percentage > 0){
                
                 document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else{
                
               document.querySelector(DOMStrings.percentageLabel).textContent = '---'; 
            }
           
        },
        
        
    displayPercentages: function(percentages) {
        var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
        
        var nodeListForEach = function(list, callback){
            for(var i = 0; i < list.length; i++) {
                
                callback(list[i], i);
            }
        };
        
        nodeListForEach(fields, function(current , index) {
            
            if(percentages[index] > 0) {
                
                current.textContent = percentages[index] + '%';
            } else {
                
                current.textContent = '---';
            }
        });
    },
        
   dispalyMonth: function() {
       var now,months,month,year;
       
       now = new Date();
       // var christmas = new Date(2018,11,25)
       
       months = ['jan','feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Nov','Dec'];
       
       month = now.getMonth();
       
       year = now.getFullYear();
       document.querySelector(DOMStrings.dateLabel).textContent =  months[month - 1] + ' ' + year;
   },
        
        
        
        getDOMstrings: function(){
            return DOMStrings;
        }
    };
    
})();


// GLOBAL APP CONTROLLER

var controller = (function(budgetCtrl, UICtrl){
    
    var setupEventListeners = function(){
        
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        
            document.addEventListener('keypress',function(event){
                if(event.keyCode === 13 || event.which === 13)
                    {
                        ctrlAddItem();
                    }
            });
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem); 
    };
    
       var updateBudget = function() {
           
           // 1. calculate the budget
           
           budgetCtrl.calculateBudget();
           
           
           //2. return the budget
           
           var budget = budgetCtrl.getBudget();
        
        // 3. display the budget on the UI
           
           UICtrl.displayBudget(budget);
           
       };
    
    var updatePercentages = function() {
        
        // 1. calculate percentages
        
        budgetCtrl.calculatePercentages();
        
        // 2. Read percentages from the budget controller
        
        var percentages = budgetCtrl.getPercentages();
        
        //3. update the UI with new percentages
        
        UICtrl.displayPercentages(percentages);
        
    }
    
    var ctrlAddItem = function(){
     
        var input , newItem;
        // 1. get the field input data
         input = UICtrl.getInput();
        
        
        if(input.description != "" && !isNaN(input.value) && input.value > 0){
            
            
             // 2. Add the item to the budget controller
        newItem =  budgetCtrl.addItem(input.type,input.description,input.value);
        
        // 3. Add the item to the UI
        
        UICtrl.addListItem(newItem, input.type);
        
        // 4 . clear the fields
        
        UICtrl.clearFields();
        
        // 5. Calculate aand update budget
        
        updateBudget();
            
       // 6. calculate and updatePercentages
            updatePercentages();
            
        }
     
    };
    
    var ctrlDeleteItem = function(event){
        
        var itemID,splitID,type,ID;
        
       itemID =  event.target.parentNode.parentNode.parentNode.parentNode.id;
   
        if(itemID){
            
            splitID = itemID.split('-');
            
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            //1. delete the item from Data Structure
            
            budgetCtrl.deleteItem(type, ID);
            
            //2. Delete the Item from UI
            
            
            UICtrl.deleteListItem(itemID);
            
            
            //3. update and show the new budget
          
            updateBudget();
            
            // 4. calculate and updatePercentages
            updatePercentages();
            
        }
    };
    
    
    
   return {
      init:  function(){
       console.log('hi');
        
          UICtrl.dispalyMonth();
          
          UICtrl.displayBudget({
              budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
                
          });
          
          
       
       setupEventListeners();
       
       
   }  
   };
   
})(budgetController , UIConroller);

controller.init();


