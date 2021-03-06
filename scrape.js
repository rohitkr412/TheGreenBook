const request = require('request');
const cheerio = require('cheerio');
var promptList = require('prompt-list');
var fs = require('fs');
var csv = require('fast-csv');

request('http://www.thegreenbook.com/',(error,response,html) => {
    if(!error && response.statusCode == 200)
    {
        const $ = cheerio.load(html);
        const IDlist = $('.ID-list');
        const ComDlist = $('.ComD-list');
        const ConDlist = $('.ConD-list');
        var categories = [];
        var category_links = [];

        $('.ID-list a').each((i,li) => {
            const item =$(li).text();
            const link =$(li).attr('href');
            categories.push(item);
            category_links.push(link);
        });   
        
        $('.ComD-list a').each((i,li) => {
            const item =$(li).text();
            const link =$(li).attr('href');
            categories.push(item);
            category_links.push(link);
        }); 

        $('.ConD-list a').each((i,li) => {
            const item =$(li).text();
            const link =$(li).attr('href');
            categories.push(item);
            category_links.push(link);
        }); 

        var PromptList = new promptList({
                name:'order',
                message:'Please select one:',
                choices:categories
        });        

        PromptList.run().then(function(answer){
            for(var i=0;i<categories.length;i++)
            {
                if(answer == categories[i]) break;
            }
            var link = category_links[i];
            SecondPage(link);
        });
    }
});


function SecondPage(link)
{
    request(link,(error2,response2,html2) => {
        if(!error2 && response2.statusCode == 200)
        {
            const $ = cheerio.load(html2);
            const list = $('#div_Search_Results_Found');
            var SubCategories = [];
            var SubCategories_links = [];

            $('#div_Search_Results_Found a').each((i,li2) => {
                    const item2 =$(li2).text().replace(/\s\s+/g,''); 
                    const link2 =$(li2).attr('href');                       
                    SubCategories.push(item2);
                    SubCategories_links.push(link2);
            });                      


            var PromptList2 = new promptList({
                                name:'order',
                                message:'Please select one:',
                                choices:SubCategories
            });


            PromptList2.run().then(function(answer2){
                for(var i=0;i<SubCategories.length;i++)
                {
                    if(answer2 == SubCategories[i]) break;
                }
                var Sub_Category_link = SubCategories_links[i];
                Sub_Category_link = "http://www.thegreenbook.com" + Sub_Category_link;
                ThirdPage(Sub_Category_link);             
            });
        }
    });
}


function ThirdPage(Sub_Category_link)
{    
    request(Sub_Category_link,(error,response,html) => { 
        if(!error && response.statusCode == 200)
        {          
            const $ = cheerio.load(html);
            const list4 = $('.companyInformation');
            var Shops_Phone = [];
            var Shops_Name = [];
            
    
            $('.phoneBtn').each((j,li) => {
                const phone =$(li).text().replace(/\s\s+/g,'').substring(8);
                Shops_Phone.push(phone);
            });
    
            $('.H4Ver2').each((j,li2) => {
                const name =$(li2).text().replace(/\s\s+/g,'');
                Shops_Name.push(name);
            });
    
            if(Shops_Phone.length > 0)
            {
                for(var k=0;k<Shops_Phone.length;k++)
                {
                    console.log(Shops_Name[k]+' - '+Shops_Phone[k]);
                }
            }
            else
            {
                console.log("Shops empty - "+j);
            }     
            
            var ws = fs.createWriteStream('crawl.csv');
            const path = './crawl.csv';
    
            if(!fs.existsSync(path))
            csv.write([Shops_Name,Shops_Phone],{headers:true}).pipe(ws);
    
            else
            csv.writeToStream(fs.createWriteStream(path,{flags:'a'}),[Shops_Name,Shops_Phone],{headers:true});
        }
        });        
}

