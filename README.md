- need to fix skeletons
- change ./ to @/
- start tracking ips and calling ip info before saving to registers db
- file structuring
- tooltip for +x for badges
- break up register/messages/emails into different trpc components
- fix all types

- change time to epoch for register and all other time related fields
- fix `@ts-expect-error - fix this` in all files
- fix `eslint-disable-next-line @typescript-eslint/no-unsafe-call` in all files
- fix up screenshots ui
- add more fields to register table and messages table
- fix todo comments in Home0001 repo and Home0001-stats repo
- add a form field somewhere for creating a user in the firestore database
- fix bug where user not logged in, goes to a page that does not require login and then clicks a tab
- each tab content under the tabs have different margin tops, fix this

<!-- PROPERTY BUYING PROGRESS STATS -->
- add question mark tooltip for current fake data
- add in new tab for buying progress and display stats about it
    - number of people in the buying process
    - number of properties purchased
    - show table of all PROGRESS and all users via email and UID
    - show table of all DONE and all users via email and UID
    - table of all users with the most properties purchased
    - most popular to least popular property type purchased
    - total $ in deposits
    - showing pie of all different types of properties purchased
    - show pie of all different types of properties in progress
    - mobile responsive for customers tab
    - stripe data api for all transactions
    - skeleton for pie charts + anywhere that is missing
    - add directory called charts in common for all the common charts components
    - since the steps structure for buying a property now reflects steps they completed, change the language tone to reflect this
    - speed up the firestore queries
    - @funguy123 would you be open for us to migrate to postgres in the near future? we're starting to get data relations and its slowing down the queries?
    - error handle creating customers with the same email
    - fix the case where a new user cannot update a property type
    - simulate deposit button
    - display all buyingProgress UID's
    - create customer dialog needs a dropdown of property type

# sendgrid stats
curl -X GET \
  -H "Authorization: Bearer API_KEY"\
  "https://api.sendgrid.com/v3/stats?start_date=2024-06-12"
