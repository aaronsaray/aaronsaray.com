---
title: "Bookmarklet: Wage Calculator"
date: "2009-01-28"
tags:
  - javascript
---
While searching for employment, I realize I can't be super picky - but my household does have needs!  Because of this, I've developed a quick calculator / bookmarklet for the browser that I thought I'd share.  It allows you to enter a yearly or hourly amount, and it shows the corresponding amounts.  This tells you if that salary posting fits within your needs.

<!--more-->

**Features**

  * Takes hourly or yearly wage.  If amount is 200 or greater, assumes its a yearly amount.

  * Shows wages in yearly, monthly and hourly

  * Shows Gross, Company Net (assuming 25% tax bracket relatively), Independent Net (assuming 25% + 15.3% tax for medicare/social security, etc)

  * Configurable to take in other rates of tax

**The UnMinified version**:

```javascript
function bookmarklet()
{
  var independentTax = 15.3;
  var taxBracket = 25;
  var amount = prompt('amount:');
  if (amount) {
    if (amount < 200) {
      amount *= 2080; // 40 hrs a week/ 52 weeks
    }
    var output = "Gross: $" + amount + "/yr - $" + Math.round(amount/12) 
               + "/mo - $" + Math.round(amount/2080) + "/hr\n";
    var taxminus = amount * (taxBracket/100);
    output += "Cmp Net: $" + Math.round(amount-taxminus) + "/yr - $" 
           + Math.round((amount-taxminus)/12) + "/mo - $" 
           + Math.round((amount-taxminus)/2080) + "/hr\n";
    taxminus = amount * ((taxBracket+independentTax)/100);
    output += "Ind Net: $" + Math.round(amount-taxminus) + "/yr - $" 
           + Math.round((amount-taxminus)/12) + "/mo - $" 
           + Math.round((amount-taxminus)/2080) + "/hr";
    alert(output);
  }
}
```
    
