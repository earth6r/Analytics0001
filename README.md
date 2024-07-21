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
- add question mark tooltip for current fake data ✅
- add in new tab for buying progress and display stats about it ✅
    - number of people in the buying process ✅
    - number of properties purchased ✅
    - show table of all PROGRESS and all users via email and UID
    - show table of all DONE and all users via email and UID
    - table of all users with the most properties purchased
    - most popular to least popular property type purchased
    - total $ in deposits ✅
    - showing pie of all different types of properties purchased
    - show pie of all different types of properties in progress
    - mobile responsive for customers tab
    - stripe data api for all transactions
    - skeleton for pie charts + anywhere that is missing
    - add directory called charts in common for all the common charts components
    - since the steps structure for buying a property now reflects steps they completed, change the language tone to reflect this ✅
    - speed up the firestore queries
    - @funguy123 would you be open for us to migrate to postgres in the near future? we're starting to get data relations and its slowing down the queries?
    - error handle creating customers with the same email ✅
    - fix the case where a new user cannot update a property type ✅
    - simulate deposit button ✅
    - display all buyingProgress UID's ✅
    - create customer dialog needs a dropdown of property type
    - the messages table: when clicking the action button and viewing the info, then closing the dialog, the screen becomes unclickable
    - the registers table: when clicking the action button and viewing the info, then closing the dialog, the screen becomes unclickable
    - change message and register view dialog to be similar ui to the customer view dialog
    - remove labels for forms where unnecessary
    - when clicking clear for create customer, it will not clear the property type ✅
    - add toasts to all submit buttons and loadings if not already there
    - add some color to toasts i.e. red background or something for errors and green for success
    - restrict toasts being shown if notifications settings have been set to false
    - if there is no buyingProgress, customer UID will show not set but it should show regardless ✅
    - need to choose a consistent date i.e. utc time or something (use EPOCH everywhere)
    - archive customer color looks bad in dark mode ✅

CHARTS:
    - deposits over time chart 🔄
    - buying progress pie chart with cumulative (i.e. a user who completed everything will still be a count for each item)
    - buying progress bar chart with cumulative (i.e. a user who completed everything will still be a count for each item)
    - number of customers chart over time (non-cumulative)
    - number of customers chart over time (cumulative)
    - messages grouped by day of the week bar chart of 7 days of the week on x axios and count on y axios
    - deposits grouped by day of the week bar chart of 7 days of the week on x axios and count on y axios
    - lease popular properties in progress
    - a heatmap or something with a calendar view of scheduled closing dates
    - a table of scheduled closing dates

UI:
    - make the progress bar charts end lower i.e. less padding at the bottom
    - context for the date range selection
    - use select-none as many places as possible
    - themes needs to be consistent with recharts colors and pie chart colors and where ever else colors are used/needed
    - make toasts match theme 🔄

BACKEND:
    - need to filter out users who are archived: true

FEATURES:
    - make an error system to track errors and save it to the database, errors come from Home0001 (already created endpoint in Home0001 repo)
        1. Display all errors in a table

PREVIOUSLY DONE:
- ui for toast success/error ✅
- don't show toast if notifications disabled ✅
- change colors of charts to match theme ✅
- delete user permanently (delete all references as well) ✅
- profile picture url saved and retrieved from db and displayed in the header ✅
- add in email field for login so users can start saving settings to db ✅

TODAY TODO:
- add color blind message and maybe a color blind mode to update toast success/error classNames to be bg instead of border
- reset settings button (delete all local storage or if db is integrated, change db settings to initial state) - "Other" tab
- index db based on existing queries being used
- move components into index.tsx files in each directory
- use progress bar somewhere maybe buying progress for each user with 5 steps so any step is considered 20% of the progress
- change local storage settings to firestore
- restrict which emails can be used to login
- tooltip on colors
- user profiling page (you can see a user and all the data tied to that user from register, to messages, to buying progress to booked phone calls and property tours, login history, etc)
- a page for login history for both websites
- error handle create booking where the user does not exist in the users db
- error handle update profile url with a preview dialog (add spinner if image is loading)
- add placeholders for create booking form
- make interval "Not Set" if no interval is set and change to saving the value in the db
- make all tables mobile responsive
- make all tables custom to allow for view details dialog
- display `no interval` in the display settings only if it is already a defined interval
- add router.query for each settings tab
- style up user page
- add view user details link button in the view details dialog in customers page
- make this the user page: https://v0.dev/r/03u3lG5pfiI
- add duration for phone call booking and property tour booking
- validate url profile picture
- display errors firestore to the dashboard
- fix "use system theme" to work once clicked and not needing a refresh


NOTES:
- cannot tie instagram and other messaging platforms to a user unless they type in the exact phone number and the have booked at least one phone call

# sendgrid stats
curl -X GET \
  -H "Authorization: Bearer API_KEY"\
  "https://api.sendgrid.com/v3/stats?start_date=2024-06-12"
