## Modifications

As required by the Apache license:
Please note that all files dated 01/01/2021 & newer have been modified from the original...

# Activity Streams 2.0

Based on:

* http://www.w3.org/TR/activitystreams-core
* http://www.w3.org/TR/activitystreams-vocabulary

Includes experimental support for:

* http://ns.jasnell.me/interval
* http://ns.jasnell.me/social

## Getting Started

### Installation

`npm install activitystrea.ms`

### Usage

```javascript
const as = require('activitystrea.ms');

// Create a simple object
const doc = await as.object().
  name('baz').
  content(
    as.langmap()
      .set('en', 'bar')
      .set('fr', 'foo')).
  publishedNow().
  prettyWrite();
```

Which produces the output:

```json
{
  "@context": "https://www.w3.org/ns/activitystreams",
  "@type": "Object",
  "contentMap": {
    "en": "bar",
    "fr": "foo"
  },
  "name": "baz",
  "published": "2015-07-17T00:50:09.889Z"
}
```

```javascript
// Create a simple activity
const doc = await as.create().
  actor('acct:sally@example.org').
  object('http://www.example.org/post').
  prettyWrite();
```

Which produces the output:
```json
{
  "@context": "https://www.w3.org/ns/activitystreams",
  "@type": "Create",
  "actor": "acct:sally@example.org",
  "object": "http://www.example.org/post"
}
```

You can also use the Node.js stream model for parsing:
```javascript
const fs = require('fs');
const AS2Stream = as.Stream;
const path = require('path');
const through = require('through2');

fs.createReadStream(path.resolve(__dirname,'test.json'))
  .pipe(new AS2Stream())
  .pipe(through.obj((obj,encoding,callback) => {
    console.log(obj.type);
    console.log(obj.name);
  }));
```
And writing:
```javascript
const as = require('activitystrea.ms');
const through = require('through2');
as.object()
  .name('test')
  .get()
  .pipe(process.stdout);
```

The API uses a fluent factory pattern for creating AS objects. There are
factory methods for each of the main types of objects defined by the Activity
Streams 2.0 vocabulary. Each takes an optional array of types that will be set
on the object. If the `[types]` is unspecified, a default will be assigned
depending on the object being created. Each of the factory methods returns a
builder specific to the kind of object being generated. Once the object has
been built, call the `get` method to return the generated object.

* `as.object([types])`
* `as.activity([types])`
* `as.collection([types])`
* `as.orderedCollection([types])`
* `as.collectionPage([types])`
* `as.orderedCollectionPage([types])`
* `as.link([types])`
* `as.accept([types])`
* `as.tentativeAccept([types])`
* `as.add([types])`
* `as.arrive([types])`
* `as.create([types])`
* `as.delete([types])`
* `as.favorite([types])`
* `as.follow([types])`
* `as.ignore([types])`
* `as.join([types])`
* `as.leave([types])`
* `as.like([types])`
* `as.offer([types])`
* `as.invite([types])`
* `as.reject([types])`
* `as.tentativeReject([types])`
* `as.remove([types])`
* `as.undo([types])`
* `as.update([types])`
* `as.view([types])`
* `as.listen([types])`
* `as.read([types])`
* `as.move([types])`
* `as.travel([types])`
* `as.announce([types])`
* `as.block([types])`
* `as.flag([types])`
* `as.dislike([types])`
* `as.application([types])`
* `as.content([types])`
* `as.group([types])`
* `as.person([types])`
* `as.service([types])`
* `as.article([types])`
* `as.document([types])`
* `as.profile([types])`
* `as.audio([types])`
* `as.image([types])`
* `as.video([types])`
* `as.note([types])`
* `as.page([types])`
* `as.question([types])`
* `as.event([types])`
* `as.place([types])`
* `as.connection([types])`
* `as.mention([types])`
* `as.tombstone([types])`
* `as.interval([types])`
* `as.interval.open([types])`
* `as.interval.closed([types])`
* `as.interval.openClosed([types])`
* `as.interval.closedOpen([types])`
* `as.interval.rightOpen([types])`
* `as.interval.leftClosed([types])`
* `as.interval.rightClosed([types])`
* `as.social.population([types])`
* `as.social.everyone([types])`
* `as.social.public([types])`
* `as.social.private([types])`
* `as.social.direct([types])`
* `as.social.common([types])`
* `as.social.interested([types])`
* `as.social.self([types])`
* `as.social.all([types])`
* `as.social.any([types])`
* `as.social.none([types])`


The object returned by `get()` is a read-only view of the Activity Stream
object. It will have property methods that are specific to the object's type.
You can export the built object as an ordinary Javascript object using the
`export` method. This will generate a JSON-LD compliant Javascript object.

```javascript
const as = require('activitystrea.ms');

const note = as.note().
               name('foo').
               content('this is a simple note').
               get();

console.log(note.name.valueOf());
console.log(note.content.valueOf());
console.log(note.type);
```

```javascript
const as = require('activitystrea.ms');

as.note().
   name('foo').
   content('this is a simple note').
   get().
   export((err, obj) => {
     if (err) throw err;
     // obj is an ordinary javascript object
     console.log(obj['@type']);
     console.log(obj['name']);
     console.log(obj['content']);
   });
```

To serialize the Activity Streams object out as JSON, use the `write`,
`prettyWrite`, or `pipe` methods

```javascript
const as = require('activitystrea.ms');

const doc = await as.note().
   name('foo').
   content('this is a simple note').
   write();
```

```javascript
const as = require('activitystrea.ms');

const doc = await as.note().
   name('foo').
   content('this is a simple note').
   prettyWrite();
```

```javascript
const as = require('activitystrea.ms');
const through = require('through2');
as.object()
  .name('test')
  .get()
  .pipe(process.stdout);
```

Note that The `export`, `write`, and `prettyWrite` methods are all async and return promises.
This is largely because of the JSON-LD processing that's happening under the covers.

## API

### `const as = require('activitystrea.ms')`

The base module.

#### `<as.models.Object.Builder> as.object([types])`

Returns a new `as.models.Object.Builder` instance.

#### `<as.models.Activity.Builder> as.activity([types])`

Returns a new `as.models.Activity.Builder` instance.

#### `<as.models.Collection.Builder> as.collection([types])`

Returns a new `as.models.Collection.Builder` instance.

#### `<as.models.OrderedCollection.Builder> as.orderedCollection([types])`

Returns a new `as.models.OrderedCollection.Builder` instance.

#### `<as.models.CollectionPage.Builder> as.collectionPage([types])`

Returns a new `as.models.CollectionPage.Builder` instance.

#### `<as.models.OrderedCollectionPage.Builder> as.orderedCollectionPage([types])`

Returns a new `as.models.OrderedCollectionPage.Builder` instance.

#### `<as.models.Link.Builder> as.link([types])`

Returns a new `as.models.Link.Builder` instance.

#### `<as.models.Activity.Builder> as.accept([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Accept` activity.

#### `<as.models.Activity.Builder> as.tentativeAccept([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#TentativeAccept` activity.

#### `<as.models.Activity.Builder> as.add([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Add` activity.

#### `<as.models.Activity.Builder> as.arrive([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Arrive` activity.

#### `<as.models.Activity.Builder> as.create([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Create` activity.

#### `<as.models.Activity.Builder> as.delete([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Delete` activity.

#### `<as.models.Activity.Builder> as.follow([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Follow` activity.

#### `<as.models.Activity.Builder> as.ignore([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Ignore` activity.

#### `<as.models.Activity.Builder> as.join([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Join` activity.

#### `<as.models.Activity.Builder> as.leave([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Leave` activity.

#### `<as.models.Activity.Builder> as.like([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Like` activity.

#### `<as.models.Activity.Builder> as.offer([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Offer` activity.

#### `<as.models.Activity.Builder> as.invite([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Invite` activity.

#### `<as.models.Activity.Builder> as.reject([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Reject` activity.

#### `<as.models.Activity.Builder> as.tentativeReject([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#TentativeReject` activity.

#### `<as.models.Activity.Builder> as.remove([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Remove` activity.

#### `<as.models.Activity.Builder> as.undo([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Undo` activity.

#### `<as.models.Activity.Builder> as.update([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Update` activity.

#### `<as.models.Activity.Builder> as.view([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#View` activity.

#### `<as.models.Activity.Builder> as.listen([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Listen` activity.

#### `<as.models.Activity.Builder> as.read([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Read` activity.

#### `<as.models.Activity.Builder> as.move([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Move` activity.

#### `<as.models.Activity.Builder> as.travel([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Travel` activity.

#### `<as.models.Activity.Builder> as.announce([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Announce` activity.

#### `<as.models.Activity.Builder> as.block([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Block` activity.

#### `<as.models.Activity.Builder> as.flag([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Flag` activity.

#### `<as.models.Activity.Builder> as.dislike([types])`

Returns a new `as.models.Activity.Builder` instance generating an `http://www.w3.org/ns/activity#Dislike` activity.

#### `<as.models.Object.Builder> as.application([types])`

Returns a new `as.models.Object.Builder` instance generating an `http://www.w3.org/ns/activity#Application` object.

#### `<as.models.Object.Builder> as.group([types])`

Returns a new `as.models.Object.Builder` instance generating an `http://www.w3.org/ns/activity#Group` object.

#### `<as.models.Object.Builder> as.person([types])`

Returns a new `as.models.Object.Builder` instance generating an `http://www.w3.org/ns/activity#Person` object.

#### `<as.models.Object.Builder> as.service([types])`

Returns a new `as.models.Object.Builder` instance generating an `http://www.w3.org/ns/activity#Service` object.

#### `<as.models.Object.Builder> as.organization([types])`

Returns a new `as.models.Object.Builder` instance generating an `http://www.w3.org/ns/activity#Organization` object.

#### `<as.models.Object.Builder> as.article([types])`

Returns a new `as.models.Object.Builder` instance generating an `http://www.w3.org/ns/activity#Article` object.

#### `<as.models.Object.Builder> as.document([types])`

Returns a new `as.models.Object.Builder` instance generating an `http://www.w3.org/ns/activity#Document` object.

#### `<as.models.Object.Builder> as.audio([types])`

Returns a new `as.models.Object.Builder` instance generating an `http://www.w3.org/ns/activity#Audio` object.

#### `<as.models.Object.Builder> as.image([types])`

Returns a new `as.models.Object.Builder` instance generating an `http://www.w3.org/ns/activity#Image` object.

#### `<as.models.Object.Builder> as.video([types])`

Returns a new `as.models.Object.Builder` instance generating an `http://www.w3.org/ns/activity#Video` object.

#### `<as.models.Object.Builder> as.note([types])`

Returns a new `as.models.Object.Builder` instance generating an `http://www.w3.org/ns/activity#Note` object.

#### `<as.models.Object.Builder> as.page([types])`

Returns a new `as.models.Object.Builder` instance generating an `http://www.w3.org/ns/activity#Page` object.

#### `<as.models.Question.Builder> as.question([types])`

Returns a new `as.models.Question.Builder` instance generating an `http://www.w3.org/ns/activity#Question` object.

#### `<as.models.Object.Builder> as.event([types])`

Returns a new `as.models.Object.Builder` instance generating an `http://www.w3.org/ns/activity#Event` object.

#### `<as.models.Relationship.Builder> as.relationship([types])`

Returns a new `as.models.Relationship.Builder` instance generating an `http://www.w3.org/ns/activity#Relationship` object.

#### `<as.models.Profile.Builder> as.profile([types])`

Returns a new `as.models.Profile.Builder` instance generating an `http://www.w3.org/ns/activity#Profile` object.

#### `<as.models.Place.Builder> as.place([types])`

Returns a new `as.models.Place.Builder` instance generating an `http://www.w3.org/ns/activity#Place` object.

#### `<as.models.Link.Builder> as.mention([types])`

Returns a new `as.models.Link.Builder` instance generating an `http://www.w3.org/ns/activity#Mention` link.

#### `<as.models.Tombstone.Builder> as.tombstone([types])`

Returns a new `as.models.Tombstone.Builder` instance generating an
`http://www.w3.org/ns/activity#Tombstone` object.

#### `<void> as.import(obj, callback)`

Imports the specified JavaScript object `obj`, performing JSON-LD expansion as necessary. When the import is complete, the `callback` function will be invoked with the imported `as.model.Object` as the second argument. If an error occurs, the error will be passed as the first argument to the `callback`.

```javascript
var obj = {
  '@context': 'https://www.w3.org/ns/activitystreams',
  '@type': 'Person',
  name: 'Joe'
};
as.import(obj, (err, imp) => {
  if (err) throw err;
  console.log(imp.type);
});
```

#### `as.Stream()`

Returns a new Node.js Transform Stream that parses JSON input into an appropriate `as.models.Object` instance.

```javascript
const through = require('through2');
const fs = require('fs');
const fsstr = fs.createReadStream('data.json');
fsstr.pipe(new as.Stream())
     .pipe(through.obj((chunk,encoding,callback) => {
        console.log(chunk.name);
        callback();
     }));
```

#### `as.Middleware`

Express/Connect middleware that parses the request payload as AS2

```javascript
const app = require('express')();
app.post('/', as.Middleware, (req,res) => {
  res.status(200);
  res.set({'Content-Type': as.mediaType});
  req.body.pipe(res);
});
```

#### `as.mediaType`

Set to a constant value of `application/activity+json`

### `as.models.Base(expanded, builder)`

`as.models.Base` is the base class for all objects. It is not intended to be used directly by developers.

 * `expanded` - The underlying JSON-LD expanded JavaScript object
 * `builder` - A `as.model.Base.Builder` subclass

#### Property: `<string> as.models.Base.prototype.id`

Returns the value of the JSON-LD `@id` property or `underfined`.

#### Property: `<string||string[]> as.models.Base.prototype.type`

Returns the value of the JSON-LD `@type` property. If `@type` has only a single value, then a single JavaScript string will be returned. If the `@type` has multiple values, a JavaScript Array will be returned. If the `@type` is not specified, `undefined` will be returned.

#### Method: `<boolean> as.models.Base.prototype.has(key)`

Returns true if the object has a value for the specified `key`

#### Method: `<any> as.models.Base.prototype.get(key)`

Returns the value for the specified `key`. The return value will vary based on the property being requested. The return value can be a JavaScript primitive, a `as.models.Base` instance, or an Iterable  of JavaScript primitives or `as.models.Base` instances. Will returned `undefined` if the no value is specified for the given `key`

#### Method: `<Promise> as.models.Base.prototype.export([options])`

Exports the object by performing a JSON-LD compaction. If export fails, the promise will reject with the error. If the export succeeds, the promise will resolve with the exported JavaScript object.

```javascript
const obj = as.object().name('Joe').get();
obj.export((err,exp) => {
  if (err) throw err;
  console.log(exp.name);
  console.log(exp['@type']);
});
```

#### Method: `<Promise> as.models.Base.prototype.write([options])`

Write the object out to a JSON-LD string. If writing fails, the promise will reject with the error. If the write succeeds, the promise will resolve with the JSON-LD string.

```javascript
const obj = as.object().name('Joe').get();
obj.write((err,string) => {
  if (err) throw err;
  console.log(string);
});
```

#### Method: `<Promise> as.models.Base.prototype.prettyWrite([options])`

Write the object out to a JSON-LD string. If writing fails, the promise will reject with the error. If the write succeeds, the promise will resolve with the JSON-LD string.

```javascript
const obj = as.object().name('Joe').get();
obj.prettyWrite((err,string) => {
  if (err) throw err;
  console.log(string);
});
```

#### Method: `<as.models.Base.Builder<?>> as.models.Base.prototype.modify()`

Returns a new `as.models.Base.Builder` instance that can be used to modify
this object.

#### Method: `<ReadableStream> as.models.Base.prototype.stream()`

Returns a Readable Stream instance that can be used to read this object as a stream of JSON-LD data.

#### Method: `<ReadableStream> as.models.Base.prototype.pipe(Writable[, options])`

Pipes this objects JSON-LD to the specified writable

```javascript
const obj = as.person().name('Sally').get();
obj.pipe(process.stdout);
```

#### Method: `<function> as.models.Base.prototype.template()`

Returns a funtion that can be used to create new `as.models.Base.Builder` instances using this object as a template. The new Builder will be pre-filled with the properties already specified on this object.

```javascript
const templ = as.like().actor('http://example.org/sally').get().template();
templ().object('http://example.org/1').pipe(process.stdout);
templ().object('http://example.org/2').pipe(process.stdout);
```

### Class: `as.models.Base.Builder(types, base)`

The base Builder interface. This is not intended to be used directly by developers. Most of the methods on the Builder instances return a reference
back to the Builder itself allowing methods to be chained.

#### Method: `<Builder> as.models.Base.Builder.prototype.id(val)`

Set the value of the `@id` property. Calling this repeatedly will overwrite the previous value.

#### Method: `<Builder> as .models.Base.Builder.prototype.set(key, val[, options])`

Set a value for the specified key.

```javascript
const object = as.object();
object.set('foo', 'bar');
```

#### Method: `<as.models.Base> as.models.Base.Builder.prototype.get()`

Returns the constructed `as.models.Base` instance.

### `as.models.Object` > `as.models.Base`

The base class for all Activity Streams 2.0 Object instances. Inherits from `as.models.Base`

#### Property: `as.models.Object.prototype.attachment`

Returns the value of the `https://www.w3.org/ns/activitystreams#attachment` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Object.prototype.attributedTo'

Returns the value of the `https://www.w3.org/ns/activitystreams#attributedTo` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Object.prototype.content`

Returns the value of the `https://www.w3.org/ns/activitystreams#content` property. Will be either `undefined` or a `as.models.LanguageValue`.

#### Property: `as.models.Object.prototype.context`

Returns the value of the `https://www.w3.org/ns/activitystreams#context` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Object.prototype.name`

Returns the value of the `https://www.w3.org/ns/activitystreams#name` property. Will be either `undefined` or a `as.models.LanguageValue`.

#### Property: `as.models.Object.prototype.summary`

Returns the value of the `https://www.w3.org/ns/activitystreams#summary` property. Will be either `undefined` or a `as.models.LanguageValue`.

#### Property: `as.models.Object.prototype.endTime`

Returns the value of the `https://www.w3.org/ns/activitystreams#endTime` property. Will be either `undefined` or a JavaScript Date object.

#### Property: `as.models.Object.prototype.published`

Returns the value of the `https://www.w3.org/ns/activitystreams#published` property. Will be either `undefined` or a JavaScript Date object.

#### Property: `as.models.Object.prototype.startTime`

Returns the value of the `https://www.w3.org/ns/activitystreams#startTime` property. Will be either `undefined` or a JavaScript Date object.

#### Property: `as.models.Object.prototype.updated`

Returns the value of the `https://www.w3.org/ns/activitystreams#updated` property. Will be either `undefined` or a JavaScript Date object.

#### Property: `as.models.Object.prototype.generator`

Returns the value of the `https://www.w3.org/ns/activitystreams#generator` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Object.prototype.icon`

Returns the value of the `https://www.w3.org/ns/activitystreams#icon` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Object.prototype.image`

Returns the value of the `https://www.w3.org/ns/activitystreams#image` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Object.prototype.inReplyTo`

Returns the value of the `https://www.w3.org/ns/activitystreams#inReplyTo` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Object.prototype.location`

Returns the value of the `https://www.w3.org/ns/activitystreams#location` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Object.prototype.preview`

Returns the value of the `https://www.w3.org/ns/activitystreams#preview` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Object.prototype.replies`

Returns the value of the `https://www.w3.org/ns/activitystreams#replies` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Object.prototype.audience`

Returns the value of the `https://www.w3.org/ns/activitystreams#audience` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Object.prototype.tag`

Returns the value of the `https://www.w3.org/ns/activitystreams#tag` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Object.prototype.url`

Returns the value of the `https://www.w3.org/ns/activitystreams#url` property. Will be either `undefined` or an Iterable  of `as.model.Link` instances.

#### Property: `as.models.Object.prototype.to`

Returns the value of the `https://www.w3.org/ns/activitystreams#to` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Object.prototype.bto`

Returns the value of the `https://www.w3.org/ns/activitystreams#bto` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Object.prototype.cc`

Returns the value of the `https://www.w3.org/ns/activitystreams#cc` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Object.prototype.bcc`

Returns the value of the `https://www.w3.org/ns/activitystreams#bcc` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

### Class: `as.models.Object.Builder > as.models.Base.Builder`

Builder for `as.models.Object` instances.

#### Method: `<Builder> as.models.Object.Builder.prototype.attachment(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#attachment` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.attributedTo(val)'

Adds a value to the `https://www.w3.org/ns/activitystreams#attributedTo` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.content(val)`

Sets an optional language-tagged value for the `https://www.w3.org/ns/activitystreams#content` property. To set
language-tagged values, use the `as.langmap` method to create a
LanguageValue.Builder.

```
as.object()
  .content('simple content')
  .get();
```

```
as.object()
  .content(
    as.langmap()
      .set('default content')
      .set('es', 'other content')
  )
  .get();
```

#### Method: `<Builder> as.models.Object.Builder.prototype.context(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#context` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.name(val)`

Sets an optional language-tagged value for the `https://www.w3.org/ns/activitystreams#name` property.

```
as.object()
  .name('simple display name')
  .get();
```

```
as.object()
  .name(
    as.langmap()
      .set('default display name')
      .set('es', 'other display name')
  )
  .get();
```

#### Method: `<Builder> as.models.Object.Builder.prototype.summary(val)`

Sets an optional language-tagged value for the `https://www.w3.org/ns/activitystreams#summary` property.

```
as.object()
  .summary('simple summary')
  .get();
```

```
as.object()
  .summary(
    as.langmap()
      .set('default summary')
      .set('es', 'other summary')
  )
  .get();
```

#### Method: `<Builder> as.models.Object.Builder.prototype.endTime(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#endTime` property.
The value *must* be a JavaScript Date object.

#### Method: `<Builder> as.models.Object.Builder.prototype.endTimeNow()`

Sets the value of the `https://www.w3.org/ns/activitystreams#endTime` property to the current date and time.

#### Method: `<Builder> as.models.Object.Builder.prototype.published(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#published` property.
The value *must* be a JavaScript Date object.

#### Method: `<Builder> as.models.Object.Builder.prototype.publishedNow()`

Sets the value of the `https://www.w3.org/ns/activitystreams#published` property to the current date and time.

#### Method: `<Builder> as.models.Object.Builder.prototype.startTime(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#startTime` property.
The value *must* be a JavaScript Date object.

#### Method: `<Builder> as.models.Object.Builder.prototype.startTimeNow()`

Sets the value of the `https://www.w3.org/ns/activitystreams#startTime` property to the current date and time.

#### Method: `<Builder> as.models.Object.Builder.prototype.updated(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#updated` property.
The value *must* be a JavaScript Date object.

#### Method: `<Builder> as.models.Object.Builder.prototype.updatedNow()`

Sets the value of the `https://www.w3.org/ns/activitystreams#updated` property to the current date and time.

#### Method: `<Builder> as.models.Object.Builder.prototype.generator(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#generator` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.icon(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#icon` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.image(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#image` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.inReplyTo(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#inReplyTo` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.location(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#location` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.preview(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#preview` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.replies(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#replies` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.audience(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#audience` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.tag(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#tag` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.url(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#url` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.to(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#to` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.bto(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#bto` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.cc(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#cc` property.

#### Method: `<Builder> as.models.Object.Builder.prototype.bcc(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#bcc` property.

### Class: `as.models.Activity > as.models.Object`

Base class for all Activity Streams 2.0 Activity instances. Inherits from `as.models.Object`

#### Property: `as.models.Activity.prototype.actor`

Returns the value of the `https://www.w3.org/ns/activitystreams#actor` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Activity.prototype.object`

Returns the value of the `https://www.w3.org/ns/activitystreams#object` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Activity.prototype.target`

Returns the value of the `https://www.w3.org/ns/activitystreams#target` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Activity.prototype.result`

Returns the value of the `https://www.w3.org/ns/activitystreams#result` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Activity.prototype.origin`

Returns the value of the `https://www.w3.org/ns/activitystreams#origin` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

#### Property: `as.models.Activity.prototype.instrument`

Returns the value of the `https://www.w3.org/ns/activitystreams#instrument` property. Will be either `undefined` or an Iterable  of `as.model.Base` instances.

### Class: `as.models.Activity.Builder > as.models.Object.Builder`

The base class for all `as.models.Activity` builder instances. Inherits from `as.models.Object.Builder`

#### Method: `<Builder> as.models.Activity.Builder.actor(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#actor` property.

#### Method: `<Builder> as.models.Activity.Builder.object(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#object` property.

#### Method: `<Builder> as.models.Activity.Builder.target(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#target` property.

#### Method: `<Builder> as.models.Activity.Builder.result(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#result` property.

#### Method: `<Builder> as.models.Activity.Builder.origin(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#origin` property.

#### Method: `<Builder> as.models.Activity.Builder.instrument(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#instrument` property.

### Class: `as.models.Collection > as.models.Object`

The base class for all Activity Streams 2.0 Collection objects. Inherits from `as.models.Object`

#### Property: `as.models.Collection.prototype.totalItems`

Returns the value of the `https://www.w3.org/ns/activitystreams#totalItems` property. The value will either be `undefined` or a numeric integer greater than or equal to zero.

#### Property: `as.models.Collection.prototype.current`

Returns the value of the `https://www.w3.org/ns/activitystreams#current` property. The value will either be `undefined` or a `as.models.Base` instance.

#### Property: `as.models.Collection.prototype.last`

Returns the value of the `https://www.w3.org/ns/activitystreams#last` property. The value will either be `undefined` or a `as.models.Base` instance.

#### Property: `as.models.Collection.prototype.first`

Returns the value of the `https://www.w3.org/ns/activitystreams#first` property. The value will either be `undefined` or a `as.models.Base` instance.

#### Property: `as.models.Collection.prototype.items`

Returns the value of the `https://www.w3.org/ns/activitystreams#items` property as an Iterable of `as.models.Base` instances.

### Class: `as.models.Collection.Builder> as.models.Object.Builder`

The base class for all `as.models.Collection` builders. Inherits from `as.models.Object.Builder`

#### Method: `<Builder> as.models.Collection.Builder.prototype.totalItems(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#totalItems` property. The value must be a numeric integer greater than or equal to 0.

#### Method: `<Builder> as.models.Collection.Builder.current(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#current` property. The value must either be a URL string or a `as.models.Link` instance.

#### Method: `<Builder> as.models.Collection.Builder.last(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#last` property. The value must either be a URL string or a `as.models.Link` instance.

#### Method: `<Builder> as.models.Collection.Builder.first(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#first` property. The value must either be a URL string or a `as.models.Link` instance.

#### Method: `<Builder> as.models.Collection.Builder.items(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#items` property.

### Class: `as.models.OrderedCollection > as.models.Collection`

The base class for all Activity Streams 2.0 OrderedCollection objects. Inherits from `as.models.Collection`

### Class: `as.models.OrderedCollection.Builder > as.models.Collection.Builder`

The base class for all `as.models.OrderedCollection` builders. Inherits from `as.models.Collection.Builder`

### Class: `as.models.CollectionPage > as.models.Collection`

The base class for all `as.models.CollectionPage` instances. Inherits from `as.models.Collection`

#### Property: `as.models.CollectionPage.prototype.next`

Returns the value of the `https://www.w3.org/ns/activitystreams#next` property. The value will either be `undefined` or a `as.models.Base` instance.

#### Property: `as.models.CollectionPage.prototype.prev`

Returns the value of the `https://www.w3.org/ns/activitystreams#prev` property. The value will either be `undefined` or a `as.models.Base` instance.

### Class: `as.models.CollectionPage.Builder > as.models.Collection.Builder`

The base class for all `as.models.CollectionPage` builders. Inherits from `as.models.Collection.Builder`

#### Method: `<Builder> as.models.CollectionPage.Builder.next(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#next` property. The value must either be a URL string or a `as.models.Link` instance.

#### Method: `<Builder> as.models.CollectionPage.Builder.prev(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#prev` property. The value must either be a URL string or a `as.models.Link` instance.

### Class: `as.models.OrderedCollectionPage > as.models.CollectionPage, as.models.OrderedCollection`

The base class for all `as.models.OrderedCollectionPage` instances. Inherits from both `as.models.CollectionPage` and `as.models.OrderedCollection`

#### Property: `as.models.OrderedCollectionPage.prototype.startIndex`

Returns the value of the `https://www.w3.org/ns/activitystreams#startIndex` property. The value will either be `undefined` or a numeric integer greater than or equal to zero.

### Class: `as.models.OrderedCollectionPage.Builder > as.models.CollectionPage.Builder, as.models.OrderedCollection.Builder`

The base class for all `as.models.OrderedCollectionPage` builders. Inherits from both `as.models.CollectionPage.Builder` and `as.models.OrderedCollection.Builder`.

#### Method: `as.models.OrderedCollectionPage.Builder.prototype.startIndex(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#startIndex` property. The value must be a numeric integer greater than or equal to zero.

### Class: `as.models.Link > as.models.Base`

The base class for all Activity Streams 2.0 Links. Inherits from `as.models.Base`

#### Property: `as.models.Link.prototype.href`

Returns the value of the `https://www.w3.org/ns/activitystreams#href` property. The value will either be `undefined` or a URL string.

#### Property: `as.models.Link.prototype.rel`

Returns the value of the `https://www.w3.org/ns/activitystreams#rel` property. The value will either be `undefined` or an Iterable  of strings.

#### Property: `as.models.Link.prototype.mediaType`

Returns the value of the `https://www.w3.org/ns/activitystreams#mediaType` property. The value will either be `undefined` or a MIME Media Type.

#### Property: `as.models.Link.prototype.name`

Returns the value of the `https://www.w3.org/ns/activitystreams#name` property as a `LanguageValue`.

#### Property: `as.models.Link.prototype.hreflang`

Returns the value of the `https://www.w3.org/ns/activitystreams#hreflang` property. The value will either be `undefined` or an RFC 5646 Language Tag.

#### Property: `as.models.Link.prototype.height`

Returns the value of the `https://www.w3.org/ns/activitystreams#height` property.The value will either be `undefined` or a numeric integer greater than or equal to zero.

#### Property: `as.models.Link.prototype.width`

Returns the value of the `https://www.w3.org/ns/activitystreams#width` property.The value will either be `undefined` or a numeric integer greater than or equal to zero.

#### Property: `as.models.Link.prototype.duration`

Returns the value of the `https://www.w3.org/ns/activitystreams#duration` property. The value will either be `undefined, a numeric integer, or an ISO 8601 duration string.

### Class: `as.models.Link.Builder > as.models.Base.Builder`

The base class for all `as.models.Link` builders. Inherits from `as.models.Base.Builder`

#### Method: `<Builder> as.models.Link.Builder.prototype.href(val)`

Specifies the value of the `https://www.w3.org/ns/activitystreams#href` property. The value must be a URL string.

#### Method: `<Builder> as.models.Link.Builder.prototype.rel(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#rel` property;

#### Method: `<Builder> as.models.Link.Builder.prototype.mediaType(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#mediaType` property. The value must be a valid MIME type.

#### Method: `<Builder> as.models.Link.Builder.prototype.name(val)`

Specifies an optionally language-tagged name.

```
as.link()
  .name('simple display name')
  .get();
```

```
as.link()
  .name(
    as.langmap()
      .set('default display name')
      .set('es', 'other display name')
  )
  .get();
```

#### Method: `<Builder> as.models.Link.Builder.prototype.hreflang(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#hreflang` property.
The value must be an RFC 5646 Language Tag.

#### Method: `<Builder> as.models.Link.Builder.prototype.height(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#height` property.
The value is a numeric integer greater than or equal to zero.

#### Method: `<Builder> as.models.Link.Builder.prototype.width(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#width` property.
The value is a numeric integer greater than or equal to zero.

#### Method: `<Builder> as.models.Link.Builder.prototype.duration(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#duration` property.
The value is either a numeric integer indicate a number of seconds, or an
ISO 8601 Duration.

### Class: `as.models.Place > as.models.Object`

The base class for all Activity Streams 2.0 Place objects. Inherits from `as.models.Object`

#### Property: `as.models.Place.prototype.accuracy`

Returns the value of the `https://www.w3.org/ns/activitystreams#accuracy` property. The value will either be `undefined` or a numeric integer in the range 0 <= n <= 100.

#### Property: `as.models.Place.prototype.altitude`

Returns the value of the `https://www.w3.org/ns/activitystreams#altitude` property. The value will be either `undefined` or a numeric float.

#### Property: `as.models.Place.prototype.latitude`

Returns the value of the `https://www.w3.org/ns/activitystreams#latitude` property. The value will be either `undefined` or a numeric float in the range -90.0 <= n <= 90.0.

#### Property: `as.models.Place.prototype.longitude`

Returns the value of the `https://www.w3.org/ns/activitystreams#longitude` property. The value will be either `undefined` or a numeric float in the range -180.0 <= n <= 180.0.

#### Property: `as.models.Place.prototype.radius`

Returns the value of the `https://www.w3.org/ns/activitystreams#radius` property.
The value will be either `undefined` or a numeric float greater than or equal to zero.

#### Property: `as.models.Place.prototype.units`

Returns the value of the `https://www.w3.org/ns/activitystreams#units` property. The value will be one of: `cm`, `feet`, `inches`, `km`, `m`, `miles`, or any absolute URI.

### Class: `as.models.Place.Builder > as.models.Object.Builder`

The base class for all `as.models.Place` builders. Inherits from `as.models.Object.Builder`

#### Method: `as.models.Place.Builder.prototype.accuracy(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#accuracy` property.
The value is a numeric integer in the range 0 <= n <= 100

#### Method: `as.models.Place.Builder.prototype.altitude(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#altitude` property. The value is a numeric float.

#### Method: `as.models.Place.Builder.prototype.latitude(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#latitude` property. The value is a numeric float in the range -90.0 <= n <= 90.0.

#### Method: `as.models.Place.Builder.prototype.longitude(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#longitude` property. The value is a numeric float in the range -180.0 <= n <= 180.0.

#### Method: `as.models.Place.Builder.prototype.radius(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#radius` property. The value is a numeric float greater or equal to `0.0`.

#### Method: `as.models.Place.Builder.prototype.units(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#units` property.
The value must be one of: `cm`, `feet`, `inches`, `km`, `m`, `miles`, or any absolute URI.

### Class: `as.models.Profile > as.models.Object`

The base class for all Activity Streams 2.0 Profile objects. Inherits from `as.models.Object`

#### Property: `as.models.Profile.prototype.describes`

### Class: `as.models.Profile.Builder > as.models.Object.Builder`

The base class for all `as.models.Profile` builders. Inherits from
`as.models.Object.Builder`

#### Method: `as.models.Profile.Builder.prototype.describes(val)`

Sets the value of the `https://www.w3.org/ns/activitystreams#describes` property.

### Class: `as.models.Question > as.models.Activity`

The base class for all Activity Streams 2.0 Question objects. Inherits from
`as.models.Activity`;

#### Property: `as.models.Question.prototype.anyOf`

Returns the value of the `https://www.w3.org/ns/activitystreams#anyOf` property.
The value will either be `undefined` or an Iterable of `as.models.Base` objects.

#### Property: `as.models.Question.prototype.oneOf`

Returns the value of the `https://www.w3.org/ns/activitystreams#oneOf` property.
The value will either be `undefined` or an Iterable of `as.models.Base` objects.

### Class: `as.models.Question.Builder > as.models.Activity.Builder`

The base class for all `as.models.Question` builders. Inherits from
`as.models.Activity.Builder`;

#### Method: `as.models.Question.Builder.anyOf(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#anyOf` property.

#### Method: `as.models.Question.Builder.oneOf(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#oneOf` property.

### Class: `as.models.Relationship > as.models.Object`

The base class for all Activity Streams 2.0 Relationship objects. Inherits
from `as.models.Object`.

#### Property: `as.models.Relationship.prototype.subject`

Returns the value of the `https://www.w3.org/ns/activitystreams#subject` property. The value will either be `undefined` or an `as.models.Base` object.

#### Property: `as.models.Relationship.prototype.relationship`

Returns the value of the `https://www.w3.org/ns/activitystreams#relationship` property. The value will either be `undefined` or an Iterable  of `as.models.Base` objects.

#### Property: `as.models.Relationship.prototype.object`

Returns the value of the `https://www.w3.org/ns/activitystreams#object` property. The value will either be `undefined` or an Iterable  of `as.models.Base` objects.

### Class: `as.models.Relationship.Builder > as.models.Object.Builder`

The base class for all `as.models.Relationship` builders. Inherits from `as.models.Object.Builder`.

#### Method: `as.models.Relationship.Builder.prototype.subject(val)`

Sets the value of the `http://ww.w3.org/ns/activitystreams#subject` property.

#### Method: `as.models.Relationship.Builder.prototype.relationship(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#relationship` property.

#### Method: `as.models.Relationship.Builder.prototype.object(val)`

Adds a value to the `https://www.w3.org/ns/activitystreams#object` property.

### Class: `as.models.Tombstone > as.models.Object`

#### Property: `as.models.Tombstone.prototype.deleted`

Returns the date and time the object was deleted.

#### Property: `as.models.Tombstone.prototype.formerType`

Returns the former type of the object that was deleted.

### Class: `as.models.Tombstone.Builder > as.models.Object.Builder`

#### Method: `as.models.Tombstone.Builder.prototype.deleted(val)`

Sets the date and time the represented object was deleted.

#### Method: `as.models.Tombstone.Builder.prototype.formerType(val)`

Specifies the former type of the object that was deleted.

### Class: `LanguageValue`

Used to encapsulate language tagged properties within an Activity Streams document.

```javascript
// assuming the default system locale is  `en-US`:
const obj = as.object()
  .name(
    as.langmap()
      .set('default display name')
      .set('es', 'other display name')
  )
  .get();
const languagevalue = obj.name;
console.log(languagevalue.get()); // 'default display name'
console.log(languagevalue.get('es')); // 'other display name'
```

```javascript
// assuming the default system locale is  `sp`:
const obj = as.object()
  .name(
    as.langmap()
      .set('default display name')
      .set('es', 'other display name')
  )
  .get();
const languagevalue = obj.name;
console.log(languagevalue.get()); // 'other display name'
console.log(languagevalue.get('en-US')); // 'default display name'
```
