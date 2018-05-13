---
layout: post
title: Facebook Message System - in PHP
tags:
- php
---
**Update: I've gotten a lot of comments on this code.  This was a simple proof of concept at the time when Facebook was creating messages like this.  They no longer do it in this manner.  I also am not supporting any updates to this code.  Thanks for your interest!**

So Facebook has been really cool in the way that they have designed and implemented some new paradigms in the electronic communication realm.  However, one thing is a problem: they're too smart.  They have hired the best of the best - and have made that the norm.  The rest of us are struggling to keep up.

I was recently faced with a task: Make our message system like facebook's.  OK - seems easy.  I implemented what I thought would be the solution -and it worked.  Sorta.  But now, I'm hearing there are bugs.  Uh oh.  ... I think I've fixed them all - but I started from scratch.  This is what I should have done.

### Define the requirements

It's easy to say that the system should be like Facebook's.  However, how does FB actually handle the messages?  What does the user really experience in the UI/UX?  Let's define some requirements:

  * 1 person can send to 1 or more people

  * No subject - just message (this isn't entirely like Facebook - but its a requirement I put on it)

  * Response comes to everyone

  * Delete message deletes all replies/threads from now back to inception.  If a new response comes, it starts a new 'thread' to that user

  * Sent mail only shows messages you've sent that aren't already in your inbox

  * Needs to show who the entire thread message is between

  * Show new messages that are unread

  * backend: no dupe messages - meaning - the body of the message will not be duplicated to each user- normalized tables

  * You should not see a message in your inbox if you're the sender and there are no responses yet

### So there are the specs, lets do this

In order to demonstrate some of these features and practices, I'm going to have to jump ahead to the final product.  I will do my best to explain why I came up with those things, however

#### Create the MySQL tables

In order to keep the normalized feel of all of this, we'll need to create two tables.  The first table will be for the message itself.  It will contain the originator or author, when it was created, where it was created (IP), and the body of the message.  Side note: The tables will all be prefixed with a `2` because this is my second time trying to do this... hopefully this time is successful! :)

```sql
CREATE TABLE `message2` (
  `mid` int(10) unsigned NOT NULL auto_increment,
  `seq` int(10) unsigned NOT NULL default '1',
  `created_on` timestamp NOT NULL default CURRENT_TIMESTAMP,
  `created_on_ip` varchar(16) NOT NULL,
  `created_by` int(10) unsigned NOT NULL,
  `body` text NOT NULL,
  PRIMARY KEY  USING BTREE (`mid`,`seq`)
) ENGINE=InnoDB;
```

Things to note about this table:

First, the `mid` column is the message ID.  Think of each initial message as the beginning of a thread.  Instead of having unique message IDs that are all parent/children, I decided to have one main thread (`mid`) and then have messages in it - which are all defined by the `seq` (sequence number) column.  The rest is pretty self explanatory.  The `created_by` and all subsequent user identifications will be numeric ID's that may point to a different user ID somewhere else.  The last thing to note is that the primary key is based on the `mid` and the `seq` - you will never have more than one entry per `mid`/`seq`.

Next, it's time to make the recipient table.  All of the recipients that receive this need to have a pointer to that `mid`/`seq` message.  Also, the sender technically is a recipient as well.  (Later on, we'll develop SQL to not show initial sent responses in the 'inbox' for the user who sent them - as that makes no sense).
    
```sql
CREATE TABLE `message2_recips` (
  `mid` int(10) unsigned NOT NULL,
  `seq` int(10) unsigned NOT NULL,
  `uid` int(10) unsigned NOT NULL,
  `status` char(1) NOT NULL default 'N',
  KEY `m2r1` USING BTREE (`mid`,`status`),
  KEY `m2r2` USING BTREE (`uid`,`status`)
) ENGINE=InnoDB;
```

This table has the `mid`/`seq` identifier to point to the message that the users are receiving.  It then has the `uid` column - which is in a similar format to the` message2.created_by` column.  Finally, we have a `status` column - which will be `N` for new, `A` for active (or read) and `D` for deleted.  Two indexes are defined on this table.  These will not make sense until we look at the SQL that is used to generate the searches for messages.  We'll do that next.

#### Creating the PHP

For demonstration purposes, we're going to include a file called **`currentuser.php`**.  All this does is set the `$currentUser` variable to an integer.  In your full featured product, you'd probably use some sort of authentication/session system.  Here it is:

**`currentuser.php`**
```php
<?php
$currentUser = 1;
```
        
Now, the first view of the user will probably be their inbox.  If they have no messages to view, it has to say so.
Note: I am using PDO and not a lot of security based programming in this example.  Please look at the concepts and don't just copy/paste the code.
Second note: I am not really using valid HTML or pretty pages either.  The focus is on the PHP system in this case.
    
**`inbox.php`**
```php
<?php
include ('currentuser.php');
print "<h1>Acting as {$currentUser}</h1>";
print "<h2>Inbox</h2>";

$dsn = 'mysql:host=db-1.local;dbname=c3';
$PDO = new PDO($dsn, 'user', 'pass');

$sql = "
select m.mid, m.seq, m.created_on, m.created_by, m.body, r.status from message2_recips r
inner join message2 m on m.mid=r.mid and m.seq=r.seq
where r.uid=? and r.status in ('A', 'N')
and r.seq=(select max(rr.seq) from message2_recips rr where rr.mid=m.mid and rr.status in ('A', 'N'))
and if (m.seq=1 and m.created_by=?, 1=0, 1=1)
order by created_on desc";

$stmt = $PDO->prepare($sql);
$args = array($currentUser, $currentUser);

if (!$stmt->execute($args)) {
    die('error');
}
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
if (count($rows)) {
  print '<table><tr><th>Originator</th><th>When</th><th>Body</th>';
  print '<th>Status</th><th>View</th></tr>';

  foreach ($rows as $row) {
    echo '<tr><td>' . $row['created_by'] . '</td><td>' . $row['created_on'];
    echo  '</td><td>' . $row['body'] . '</td><td>' . $row['status'] . '</td><td>';
    echo '<a href="view.php?id=' . $row['mid'] . '">View</a>';
    echo '</td></tr>';
  }
  echo '</table>';
}
else {
  echo 'No items in your inbox';
}
echo '<div><a href="compose.php">compose</a></div>';
echo '<div><a href="sent.php">sent</a></div>';
```

For our demonstration, the top of the pages will always say what 'view' this is and what user we're acting as.  Your full functional site may have different features to identify this.  Also, at the top of each page, we're including our currentuser.php file and making a connection to the database.  This is all pretty standard stuff.

Next, you'll see the MySQL query I came up with.  First thing is to get both of the identifiers for the message (`mid`/`seq`), when it was created (so we can show the date), who created it (so we can show the originator or who it is 'from'), and the status.  The status will just be used to show if that message is new.

The sql gets the data from the recips table first.  This is the pointer to all of the 'copies' of the initial message that should be available.  Note that the message table itself is joined on so we can get the actual content of the message.  Next, the recipient `uid` is verified to be the current user and the message must be either New or Active.  Next, the sequence number must be a specific one.  In this case a subselect is done.  The maximum sequence number (so that would make it the newest) from the recips table where that message is the current message and the status is not deleted.  In this case we don't verify that the `uid` of that subselect is any user because we want to show any originator whether it be our self or someone else.  The last part of the where clause verifies that the sequence number is not `1` and that its not created by our current user.  If it is `1`, that means its the first message of the thread, created by us, and that we shouldn't select it.  Your inbox never shows items that you have originally sent but received no responses.

Then, the rest is pretty simple.  All of the items are retrieved.  A loop is generated and each 'newest' message is shown with a link to view it.  Notice how the view link only has the `mid`, however.  We don't need to know the sequence number as we'll be showing the entire thread.

Now, let's actually view one of the messages.

**`view.php`**
```php
<?php
include ('currentuser.php');
print "<h1>Acting as {$currentUser}</h1>";
print "<h2>Viewing a single message: " . $_GET['id'] . "</h2>";

$dsn = 'mysql:host=db-1.local;dbname=c3';
$PDO = new PDO($dsn, 'user', 'pass');

$sql = "
select m.mid, m.seq, m.created_on, m.created_by, m.body, r.status from message2_recips r
inner join message2 m on m.mid=r.mid and m.seq=r.seq
where r.uid=? and m.mid=? and r.status in ('A', 'N')";
$stmt = $PDO->prepare($sql);
$args = array($currentUser, $_GET['id']);

if (!$stmt->execute($args)) {
  die('error');
}
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
if (count($rows)) {
  /** get all of the people this is between **/
  $sql = "select distinct(uid) as uid from message2_recips where mid=?";
  $stmt = $PDO->prepare($sql);
  $args = array($_GET['id']);
  $stmt->execute($args);
  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $uids = array();
  foreach ($results as $result) {
    $uids[] = $result['uid'];
  }
  $last = array_pop($uids);

  print '<p>Conversation between ';
  print implode(', ', $uids) . ' and ' . $last;
  echo '.</p>';

  print '<table><tr><th>Originator</th><th>When</th><th>Body</th></tr>';
  foreach ($rows as $row) {
    echo '<tr><td>' . $row['created_by'] . '</td><td>' . $row['created_on'];
    echo '</td><td>' . $row['body'] . '</td></tr>';
  }
  echo '</table>';

  /** now update the message to viewed **/
  $sql = "update message2_recips set status='A' where status='N' and mid=? and uid=?";
  $stmt = $PDO->prepare($sql);
  $args = array($_GET['id'], $currentUser);
  $stmt->execute($args);

  echo '<form action="post.php" method="post">';
  echo '<strong>Reply:</strong><br></br>';
  echo '<textarea name="body"></textarea><br></br>';
  echo '<input type="hidden" name="mid" value="' . $row['mid'] . '"></input>';
  echo '<input type="submit" value="reply"></input></form>';
}
else {
  echo 'Cannot find this message';
}
echo '<div><a href="inbox.php">Inbox</a></div>';
echo '<div><a href="delete.php?id=' . $_GET['id'] . '">Delete</a></div>';
```

As mentioned before, the header is the identification of the current user, the current page we're viewing, and a connection to the database.

The sql statement gathers the same information as the inbox and joins like the inbox did.  However, the where statement is a bit more simple.  It restricts the `recips` it gets to the current user using the `uid` field, which is cool.  (Remember, we will receive 'replies' from both messages we send as well as messages other people send).  It also verifies that the message ID (`mid`) is what we're hoping to view and that the replies that we are looking to view are not deleted.

It's important to note the importance of that last part of the where statement.  As per our requirements, it is possible to delete replies that we 'own'.  However, it can still happen that someone can reply after that and we will see more of the message, just not the parts we've decided to delete.  This is the reason for that statement.

The statement is executed and if there are results, we continue on.  As per the requirements, we also need to get all of the users who this conversation is through.  We gather all of the distinct `uid` from the `recips` table where the message ID is the one we're looking at.  Then, using PHP, we gather them all into a numerically keyed array and POP off the last one.  Then, we can implode the array with commas - and then add the last one using `and`.  This way, if we have 4 recipients on this thread, it may look like this:
    
    1,2,3 and 4.

If we only had two, it would look like this:

    1 and 2
    
Next, a table is built and all of the replies are listed.  An update statement is ran to update all of the 'New' replies as seen or 'Active' for the current user.  Finally, an update form is shown.  You can add a reply to the message using this form.  Note, the hidden input of the `mid` is in this form.  This posts to the file **`post.php`** - which is the same file that **`compose.php`** will post to.  We'll cover this later.  The final link on this page is the delete.php file.  It has the ID of the current message.  Let's take a look at this.

**`delete.php`**
```php
<?php
include ('currentuser.php');
$dsn = 'mysql:host=db-1.local;dbname=c3';
$PDO = new PDO(
  $dsn, 
  'user', 
  'pass', 
  array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION)
);

$mid = isset($_GET['id']) ? $_GET['id'] : 0;
$sql = "update message2_recips set status='D' "
     . "where mid=? and status != 'D' and uid=?";
$stmt = $PDO->prepare($sql);
$args = array($mid, $currentUser);

if (!$stmt->execute($args)) {
    die('error');
}

die(header('Location: inbox.php'));
```

This is pretty simple.  Remember, we can't delete the message itself.  We can only delete the current user's reply / message pointers as of up to now.  So, the sql statement will mark all of them status of `D` for deleted where the status previously was not deleted, the message ID is the current one and the user ID is our current user.  Then, back to our inbox.

In order to view our sent items, the layout is pretty similar to the inbox.php file.  However, the SQL statement changes.  I will show just that here:

**`sent.php`**
....snip...

    select m.mid, m.seq, m.created_on, m.created_by, m.body, r.status 
    from message2_recips r
    inner join message2 m on m.mid=r.mid and m.seq=r.seq
    where m.created_by=? and r.uid=?
    and r.status != 'D'
    and m.seq=(select max(rr.seq) from message2_recips rr 
    where rr.mid=m.mid and rr.status != 'D' and rr.uid=?)
    order by created_on desc
    
.... snip ....

As with every other statement, the message ID, sequence, date, owner, status and boy are gathered.  The message table is joined onto the `recips` table.  Then, it has to be created by the current user.  To match up the proper row, the `r.uid` matches the `m.created_by` as current user.  The `recip` record must also not be deleted.  Finally, the sequence number is the maximum from the replies where it is not deleted status and the message reply belongs to the current user.  This will show both messages where multiple replies are received and the current user is the last sender - as well as messages where the user is the only sender (unlike the inbox).

Next, we have to make a new message form.  This will submit to **`post.php`** - the same as the replies to a current message.

**`compose.php`**
```html
<form action="post.php" method="post">
  To who (csv): <input type="text" name="uids"></input><br></br>
  Message: <textarea name="body"></textarea><br></br>
  <input type="submit" value="send"></input>
</form>
```

Finally, we will add messages using the **`post.php`** file.  It will handle replies and new messages.  Depending on whether a message ID is being sent will determine if it is a new message or a reply.

**`post.php`**
```php
<?php
include ('currentuser.php');
$dsn = 'mysql:host=db-1.local;dbname=c3';
$PDO = new PDO($dsn, 'user', 'pass');
 
$mid = isset($_POST['mid']) ? $_POST['mid'] : 0;
$body = $_POST['body'];
 
if (!empty($mid)) {
  /** get the recips first **/
  $sql = "SELECT distinct(uid) as uid FROM message2_recips m where mid=?";
  $stmt = $PDO->prepare($sql);
  $args = array($mid);
  if (!$stmt->execute($args)) {
    die('error');
  }
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

  /** get seq # **/
  $sql = "select max(seq)+1 as seq from message2 where mid=?";
  $args = array($mid);
  $stmt = $PDO->prepare($sql);
  $stmt->execute($args);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  $seq = $row['seq'];
}
else {
  $seq = 1;
  $uids = explode(',', $_POST['uids']);
  $uids[] = $currentUser;
  $uids = array_unique($uids);
  $rows = array();
  foreach ($uids as $uid) {
    $rows[] = array('uid'=>$uid);
  }
}

if (count($rows)) {
  $sql = "insert into message2 (mid, seq, created_on_ip, created_by, body) "
       . "values (?, ?, ?, ?, ?)";
  $args = array($mid, $seq, '1.2.2.1', $currentUser, $body);
  $stmt = $PDO->prepare($sql);
  $stmt->execute($args);

  if (empty($mid)) {
    $mid = $PDO->lastInsertId();
  }

  $insertSql = "insert into message2_recips values ";
  $holders = array();
  $params = array();
  foreach ($rows as $row) {
    $holders[] = "(?, ?, ?, ?)";
    $params[] = $mid;
    $params[] = $seq;
    $params[] = $row['uid'];
    $params[] = $row['uid'] == $currentUser ? 'A' : 'N';
  }
  $insertSql .= implode(',', $holders);
  $stmt = $PDO->prepare($insertSql);
  $stmt->execute($params);

  die(header('Location: view.php?id=' . $mid));
}
else {
  die('no recips found');
}
```

This is one of the most important pieces of this puzzle, so let's analyze it carefully.  First, the current user is obtained and the connection is made.  Then, the message ID is retrieved from the POST request (if its a reply) or its set at `0` (for new messages from **`compose.php`**).  `$body` is retrieved from the body key of the POST array.

If not empty `mid`, meaning if this is a reply, then get all of the recipients from the table where this ID exists.  It is necessary to send the new message recip pointers to all of them.  Then, get the next sequence number which will be the current maximum plus one, obviously.

Else, if empty `mid`, meaning it is a new message, then set the sequence number to `1`.  Make an array out of the user ID's that were sent.  The current user would only send to people NOT to itself, so we add the current user onto that.  Then, the IDs are uniqued - and the `$rows` variable is pre-populated to be in the same format as it would be from the database.

Next, check to make sure the `$rows` variable is populated.  This is just a sanity check - in all cases it should already be populated.  If not, generate an error.  Otherwise, insert the message into the `message2` table using the proper message ID (`0` for new message will generate a new autoincrement value), sequence number, user IP, created by (which is our current user) and the body of the message.

If we previously had an empty message ID, it is a new message - so we'll get the last insert id from the query.  This is our new Message ID.  This is needed for the insertions into the recipients table.  To do so, it is going to be a dynamically built query.  The first part is created and then holders/params variables are defined.  Now, each item in the `$rows` array are looped through.  Enough question marks for the prepared statement are added, and the rest of the parameters matching are filled in.  The only thing of note is that if the current row's user ID is the current user, then the status is `A` for active.  (they've obviously read it already).  Otherwise, it is always `N` for new.

The combined statement is now executed and the user is directed to look at the message they've created.

### Ending Thoughts

While this is not yet a perfect/polished solution, I think it is further along the line.  Old message systems used to duplicate a lot of messages and not allow for multiple recipients.  I think this walks the line of being similar to the older systems but working with new paradigms.  Are there places where I could make this better?  Have any suggestions?  Please let me know. :)
