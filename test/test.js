const assert = require('assert');
const as = require('../src/activitystreams');
const models = require('../src/models');
const asv = require('vocabs-as');
const social = require('vocabs-social');
const interval = require('vocabs-interval');
const now = new Date();
const nowiso = now.toISOString();

describe('Basics...', () => {
  it('should build a minimal object', async () => {
    var object = as.object().get();
    assert.equal(object.type, asv.Object);
  });

  function testFunctionalProperties(object) {
    assert.equal(object.content.get(), 'bar');
    assert.equal(object.content.get('fr'), 'foo');
    assert.equal(object.name.get('de'), 'baz');
    assert.equal(object.summary.get('es'), 'bar');
    assert.equal(object.endTime.toISOString(), nowiso);
    assert.equal(object.startTime.toISOString(), nowiso);
    assert.equal(object.published.toISOString(), nowiso);
    assert.equal(object.updated.toISOString(), nowiso);
  }

  it('should create an object and return all the correct values', async () => {
    var object = as.object()
      .content(
        as.langmap()
          .set('en', 'bar')
          .set('fr', 'foo'))
      .name(
        as.langmap()
          .set('de', 'baz'))
      .summary(
        as.langmap()
          .set('es', 'bar'))
      .endTime(now)
      .startTime(now)
      .published(now)
      .updated(now)
      .get();
    testFunctionalProperties(object);
  });

  it('should roundtrip correctly', async () => {
    var object = as.object()
      .content(
        as.langmap()
          .set('en', 'bar')
          .set('fr', 'foo'))
      .name(
        as.langmap()
          .set('de', 'baz'))
      .summary(
        as.langmap()
          .set('es', 'bar'))
      .endTime(now)
      .startTime(now)
      .published(now)
      .updated(now)
      .get();
    const doc = await object.export();

    const imported = await as.import(doc);
    testFunctionalProperties(imported);
  });

  it('should produce the correct default context URL', async () => {
    var object = as.object().get();
    assert(typeof(object) === 'object');
    const doc = await object.export();

    assert(typeof(doc) === 'object');
    assert(Object.prototype.hasOwnProperty.call(doc, '@context'));
    assert.equal(doc['@context'], 'https://www.w3.org/ns/activitystreams');
  });

  it('should create a basic activity object', async () => {
    const activity = as.activity().actor('http://example').get();
    assert(activity instanceof models.Object);
    assert(activity.actor);
    assert(activity.actor.first);
    assert(activity.actor.first.id, 'http://example');
  });

  it('should create a basic collection object', async () => {
    const collection = as.collection().totalItems(1).get();
    assert(collection instanceof models.Object);
    assert(collection.totalItems, 1);

  });

  it('should create a basic ordered collection object', async () => {
    const collection = as.orderedCollection().totalItems(1).get();
    assert(collection instanceof models.Object);
    assert(collection.totalItems, 1);
  });

  it('should create a basic link object', (done) => {
    assert(as.link().get() instanceof models.Link);
    done();
  });

  it('should create activities with an appropriate type', (done) => {
    [['accept', asv.Accept],
     ['tentativeAccept', asv.TentativeAccept],
     ['add', asv.Add],
     ['arrive', asv.Arrive],
     ['create', asv.Create],
     ['delete', asv.Delete],
     ['follow', asv.Follow],
     ['ignore', asv.Ignore],
     ['join', asv.Join],
     ['leave', asv.Leave],
     ['like', asv.Like],
     ['offer', asv.Offer],
     ['invite', asv.Invite],
     ['reject', asv.Reject],
     ['tentativeReject', asv.TentativeReject],
     ['remove', asv.Remove],
     ['undo', asv.Undo],
     ['update', asv.Update],
     ['view', asv.View],
     ['listen', asv.Listen],
     ['read', asv.Read],
     ['move', asv.Move],
     ['travel', asv.Travel],
     ['announce', asv.Announce],
     ['block', asv.Block],
     ['flag', asv.Flag],
     ['dislike', asv.Dislike]
   ].forEach((key) => {
      var obj = as[key[0]]().get();
      assert(obj instanceof models.Object);
      assert.equal(obj.type, key[1]);
    });
    done();
  });

  it('should create objects with an appropriate type', (done) => {
    [
     ['application', asv.Application],
     ['group', asv.Group],
     ['person', asv.Person],
     ['organization', asv.Organization],
     ['service', asv.Service],
     ['article', asv.Article],
     ['document', asv.Document],
     ['relationship', asv.Relationship],
     ['profile', asv.Profile],
     ['audio', asv.Audio],
     ['image', asv.Image],
     ['video', asv.Video],
     ['note', asv.Note],
     ['page', asv.Page],
     ['question', asv.Question],
     ['event', asv.Event],
     ['place', asv.Place]
   ].forEach((key) => {
      var obj = as[key[0]]().get();
      assert(obj instanceof models.Object);
      assert.equal(obj.type, key[1]);
    });
    done();
  });

  it('should create link objects with an appropriate type', (done) => {
    [['mention', asv.Mention]].forEach((key) => {
      var obj = as[key[0]]().get();
      assert(obj instanceof models.Link);
      assert.equal(obj.type, key[1]);
    });
    done();
  });

  it('should create a complex object', (done) => {
    // Test complex creation
    var obj =
      as.create()
        .actor('acct:joe@example.org')
        .object(as.note().content('this is a note'))
        .get();

    assert.equal(1, obj.actor.length);
    var actor = obj.actor.first;
    assert.equal('acct:joe@example.org', actor.id);
    assert(actor instanceof models.Object);

    assert.equal(1, obj.object.length);
    var note = obj.object.first;
    assert.equal(asv.Note, note.type);
    assert.equal(note.content.get(), 'this is a note');
    done();
  });

  it('should import from JSON without errors', async () => {
    const doc = await as.import({
      'type': 'Like',
      nameMap: {
        en: 'foo'
      },
      actor: {
        'type': 'Person',
        name: 'Joe'
      },
      object: {
        'type': 'http://example.org/Table',
        name: 'Table'
      }
    });

    assert.equal(asv.Like, doc.type);
    assert.equal(doc.name, 'foo');
    const actor = doc.actor.first;
    assert.equal(asv.Person, actor.type);
    assert.equal(actor.name, 'Joe');
  });

  it('should handle languages properly', async () => {
    var LanguageValue = require('../src/models/_languagevalue');
    LanguageValue.SYSLANG = 'en-US';
    var B = new LanguageValue.Builder();
    B.set('en-US', 'bar');
    B.set('fr-US', 'baz');
    B.set('fr', 'boo');
    var lv = B.get();
    assert.equal(lv.get(), 'bar');
    assert.equal(lv.get('en'), 'bar');
    assert.equal(lv.get('en-us'), 'bar');
    assert.equal(lv.get('en-US'), 'bar');
    assert.equal(lv.get('en-Us-Scrp'), 'bar');
    assert.equal(lv.get('fr'), 'boo');
    assert.equal(lv.get('FR-US'), 'baz');
  });

  it('should roundtrip the RDF properly', async () => {
    var obj = as.object().name('test').get();
    const doc = await obj.toRDF();

    assert(doc);

    const doc2 = await as.importFromRDF(doc);
    assert.equal(doc2.name.get(), 'test');
  });

  it('should import an object with just an id', async () => {
    var test = {'id': 'http://example.org'};
    const doc = await as.import(test);
    assert.equal(doc.id, 'http://example.org');
  });

  it('should have appropriate values for every orderedcollection property',
    async () => {

    var doc = as.orderedCollection()
      .id('http://example.org')
      .totalItems(1)
      .current('http://example.org/current')
      .first('http://example.org/first')
      .last('http://example.org/last')
      .items('http://example.org/item/1')
      .items('http://example.org/item/2')
      .get();
    assert(doc instanceof as.models.Object);
    assert.equal(doc.totalItems, 1);
    assert.equal(doc.current.id, 'http://example.org/current');
    assert.equal(doc.first.id, 'http://example.org/first');
    assert.equal(doc.last.id, 'http://example.org/last');
    assert.equal(doc.items.length, 2);
    const iter = doc.items[Symbol.iterator]();
    assert.equal(iter.next().value.id, 'http://example.org/item/1');
    assert.equal(iter.next().value.id, 'http://example.org/item/2');
  });

  it('should have appropriate values for every orderedcollection property',
    async () => {

    var test = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      'id': 'http://example.org',
      'type': 'OrderedCollection',
      totalItems: 1,
      current: 'http://example.org/current',
      first: 'http://example.org/first',
      last: 'http://example.org/last',
      items: [
        'http://example.org/item/1',
        'http://example.org/item/2'
      ]
    };

    const doc = await as.import(test);
    assert(doc instanceof as.models.Object);
    assert.equal(doc.totalItems, 1);
    assert.equal(doc.current.id, 'http://example.org/current');
    assert.equal(doc.first.id, 'http://example.org/first');
    assert.equal(doc.last.id, 'http://example.org/last');
    assert.equal(doc.items.length, 2);
    const iter = doc.items[Symbol.iterator]();
    assert.equal(iter.next().value.id, 'http://example.org/item/1');
    assert.equal(iter.next().value.id, 'http://example.org/item/2');
  });

  it('should have appropriate values for every collection property', async () => {

    var doc = as.collection()
      .id('http://example.org')
      .totalItems(1)
      .current('http://example.org/current')
      .first('http://example.org/first')
      .last('http://example.org/last')
      .items('http://example.org/item/1')
      .items('http://example.org/item/2')
      .get();

    assert(doc instanceof as.models.Object);
    assert.equal(doc.totalItems, 1);
    assert.equal(doc.current.id, 'http://example.org/current');
    assert.equal(doc.first.id, 'http://example.org/first');
    assert.equal(doc.last.id, 'http://example.org/last');
    assert.equal(doc.items.length, 2);
    const iter = doc.items[Symbol.iterator]();
    assert.equal(iter.next().value.id, 'http://example.org/item/1');
    assert.equal(iter.next().value.id, 'http://example.org/item/2');
  });

  it('should have appropriate values for every collection property', async () => {

    var test = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      'id': 'http://example.org',
      'type': 'Collection',
      totalItems: 1,
      current: 'http://example.org/current',
      first: 'http://example.org/first',
      last: 'http://example.org/last',
      items: [
        'http://example.org/item/1',
        'http://example.org/item/2'
      ]
    };

    const doc = await as.import(test);
    assert(doc instanceof as.models.Object);
    assert.equal(doc.totalItems, 1);
    assert.equal(doc.current.id, 'http://example.org/current');
    assert.equal(doc.first.id, 'http://example.org/first');
    assert.equal(doc.last.id, 'http://example.org/last');
    assert.equal(doc.items.length, 2);
    const iter = doc.items[Symbol.iterator]();
    assert.equal(iter.next().value.id, 'http://example.org/item/1');
    assert.equal(iter.next().value.id, 'http://example.org/item/2');
  });

  it('should have appropriate values for every activity property', async () => {
    var doc = as.activity()
      .id('http://example.org')
      .actor('http://example.org/actor')
      .object('http://example.org/object')
      .target('http://example.org/target')
      .result('http://example.org/result')
      .origin('http://example.org/origin')
      .instrument('http://example.org/instrument')
      .get();

    assert(doc instanceof as.models.Object);
    assert.equal(doc.id, 'http://example.org');

    assert(doc.actor);
    assert.equal(doc.actor.length, 1);
    assert.equal(doc.actor.first.id, 'http://example.org/actor');
    assert(doc.object);
    assert.equal(doc.object.length, 1);
    assert.equal(doc.object.first.id, 'http://example.org/object');
    assert(doc.target);
    assert.equal(doc.target.length, 1);
    assert.equal(doc.target.first.id, 'http://example.org/target');
    assert(doc.result);
    assert.equal(doc.result.length, 1);
    assert.equal(doc.result.first.id, 'http://example.org/result');
    assert(doc.origin);
    assert.equal(doc.origin.length, 1);
    assert.equal(doc.origin.first.id, 'http://example.org/origin');
    assert(doc.instrument);
    assert.equal(doc.instrument.length, 1);
    assert.equal(doc.instrument.first.id, 'http://example.org/instrument');
  });

  it('should have appropriate values for every activity property - take 2', async () => {
    var test = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      'id': 'http://example.org',
      'type': 'Activity',
      actor: 'http://example.org/actor',
      object: 'http://example.org/object',
      target: 'http://example.org/target',
      result: 'http://example.org/result',
      origin: 'http://example.org/origin',
      instrument: 'http://example.org/instrument'
    };

    const doc = await as.import(test);

    assert(doc instanceof as.models.Object);
    assert.equal(doc.id, 'http://example.org');

    assert(doc.actor);
    assert.equal(doc.actor.length, 1);
    assert.equal(doc.actor.first.id, 'http://example.org/actor');
    assert(doc.object);
    assert.equal(doc.object.length, 1);
    assert.equal(doc.object.first.id, 'http://example.org/object');
    assert(doc.target);
    assert.equal(doc.target.length, 1);
    assert.equal(doc.target.first.id, 'http://example.org/target');
    assert(doc.result);
    assert.equal(doc.result.length, 1);
    assert.equal(doc.result.first.id, 'http://example.org/result');
    assert(doc.origin);
    assert.equal(doc.origin.length, 1);
    assert.equal(doc.origin.first.id, 'http://example.org/origin');
    assert(doc.instrument);
    assert.equal(doc.instrument.length, 1);
    assert.equal(doc.instrument.first.id, 'http://example.org/instrument');
  });

  it('should have appropriate values for every link property', async () => {
    var test = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      'id': 'http://example.org',
      'type': 'Link',
      href: 'http://example.org',
      rel: ['a', 'b'],
      mediaType: 'application/text',
      name: 'the display name',
      hreflang: 'en',
      height: 10,
      width: 10,
    };
    const doc = await as.import(test);

    assert(doc instanceof as.models.Link);
    assert.equal(doc.id, 'http://example.org');
    assert.equal(doc.href, 'http://example.org');
    const iter = doc.rel[Symbol.iterator]();
    assert.equal(iter.next().value, 'a');
    assert.equal(iter.next().value, 'b');
    assert.equal(doc.mediaType, 'application/text');
    assert.equal(doc.name.get(), 'the display name');
    assert.equal(doc.hreflang, 'en');
    assert.equal(doc.height, 10);
    assert.equal(doc.width, 10);
  });

  it('should have appropriate values for every link property', async () => {
    var doc = as.link()
      .id('http://example.org')
      .href('http://example.org')
      .rel('a')
      .rel('b')
      .mediaType('application/text')
      .name('the display name')
      .hreflang('en')
      .height(10)
      .width(10)
      .get();

    assert(doc instanceof as.models.Link);
    assert.equal(doc.id, 'http://example.org');
    assert.equal(doc.href, 'http://example.org');
    const iter = doc.rel[Symbol.iterator]();
    assert.equal(iter.next().value, 'a');
    assert.equal(iter.next().value, 'b');
    assert.equal(doc.mediaType, 'application/text');
    assert.equal(doc.name.get(), 'the display name');
    assert.equal(doc.hreflang, 'en');
    assert.equal(doc.height, 10);
    assert.equal(doc.width, 10);
  });

  it('should have appropriate values for every object property', async () => {
    var test = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      'id': 'http://example.org',
      'type': 'Object',
      attachment: 'http://example.org/attachment',
      attributedTo: 'http://sally.example.org',
      content: 'the content',
      context: 'http://example.org/context',
      name: 'the display name',
      endTime: '2015-12-12T12:12:12Z',
      generator: 'http://example.org/generator',
      icon: 'http://example.org/icon',
      image: 'http://example.org/image',
      inReplyTo: 'http://example.org/in-reply-to',
      location: 'http://example.org/location',
      preview: 'http://example.org/preview',
      tag: 'http://example.org/tag',
      updated: '2015-12-12T12:12:12Z',
      published: '2015-12-12T12:12:12Z',
      replies: 'http://example.org/replies',
      audience: 'http://example.org/scope',
      startTime: '2015-12-12T12:12:12Z',
      url: 'http://example.org',
      to: 'http://joe.example.org',
      bto: 'http://sally.example.org',
      cc: 'http://mark.example.org',
      bcc: 'http://jane.example.org'
    };
    const doc = await as.import(test);

    assert.equal(doc.id, 'http://example.org');
    assert.equal(doc.type, asv.Object);
    assert(doc.attachment);
    assert.equal(doc.attachment.length, 1);
    assert.equal(doc.attachment.first.id, 'http://example.org/attachment');
    assert(doc.attributedTo);
    assert.equal(doc.attributedTo.length, 1);
    assert.equal(doc.attributedTo.first.id, 'http://sally.example.org');
    assert.equal(doc.content.get(), 'the content');
    assert(doc.context);
    assert.equal(doc.context.length, 1);
    assert.equal(doc.context.first.id, 'http://example.org/context');
    assert.equal(doc.name.get(), 'the display name');
    assert.equal(doc.endTime.valueOf(), new Date('2015-12-12T12:12:12Z').valueOf());
    assert(doc.generator);
    assert.equal(doc.generator.length, 1);
    assert.equal(doc.generator.first.id, 'http://example.org/generator');
    assert(doc.icon);
    assert.equal(doc.icon.length, 1);
    assert.equal(doc.icon.first.id, 'http://example.org/icon');
    assert(doc.image);
    assert.equal(doc.image.length, 1);
    assert.equal(doc.image.first.id, 'http://example.org/image');
    assert(doc.inReplyTo);
    assert.equal(doc.inReplyTo.length, 1);
    assert.equal(doc.inReplyTo.first.id, 'http://example.org/in-reply-to');
    assert(doc.location);
    assert.equal(doc.location.length, 1);
    assert.equal(doc.location.first.id, 'http://example.org/location');
    assert(doc.preview);
    assert.equal(doc.preview.length, 1);
    assert.equal(doc.preview.first.id, 'http://example.org/preview');
    assert(doc.tag);
    assert.equal(doc.tag.length, 1);
    assert.equal(doc.tag.first.id, 'http://example.org/tag');
    assert.equal(doc.updated.valueOf(), new Date('2015-12-12T12:12:12Z').valueOf());
    assert.equal(doc.published.valueOf(), new Date('2015-12-12T12:12:12Z').valueOf());
    assert(doc.replies);
    assert.equal(doc.replies.length, 1);
    assert.equal(doc.replies.first.id, 'http://example.org/replies');
    assert(doc.audience);
    assert.equal(doc.audience.length, 1);
    assert.equal(doc.audience.first.id, 'http://example.org/scope');
    assert(doc.url);
    assert.equal(doc.url.length, 1);
    assert.equal(doc.url.first.id, 'http://example.org');
    assert.equal(doc.startTime.valueOf(), new Date('2015-12-12T12:12:12Z').valueOf());
    assert(doc.to);
    assert.equal(doc.to.length, 1);
    assert.equal(doc.to.first.id, 'http://joe.example.org');
    assert(doc.bto);
    assert.equal(doc.bto.length, 1);
    assert.equal(doc.bto.first.id, 'http://sally.example.org');
    assert(doc.cc);
    assert.equal(doc.cc.length, 1);
    assert.equal(doc.cc.first.id, 'http://mark.example.org');
    assert(doc.bcc);
    assert.equal(doc.bcc.length, 1);
    assert.equal(doc.bcc.first.id, 'http://jane.example.org');
  });

  it('should have appropriate values for every object property', async () => {
    var doc = as.object()
      .id('http://example.org')
      .attachment('http://example.org/attachment')
      .attributedTo('http://sally.example.org')
      .content('the content')
      .context('http://example.org/context')
      .name('the display name')
      .endTime(new Date('2015-12-12T12:12:12Z'))
      .generator('http://example.org/generator')
      .icon('http://example.org/icon')
      .image('http://example.org/image')
      .inReplyTo('http://example.org/in-reply-to')
      .location('http://example.org/location')
      .preview('http://example.org/preview')
      .tag('http://example.org/tag')
      .updated(new Date('2015-12-12T12:12:12Z'))
      .published(new Date('2015-12-12T12:12:12Z'))
      .replies('http://example.org/replies')
      .audience('http://example.org/scope')
      .startTime(new Date('2015-12-12T12:12:12Z'))
      .url('http://example.org')
      .to('http://joe.example.org')
      .bto('http://sally.example.org')
      .cc('http://mark.example.org')
      .bcc('http://jane.example.org')
      .get();
      assert.equal(doc.id, 'http://example.org');
      assert.equal(doc.type, asv.Object);
      assert(doc.attachment);
      assert.equal(doc.attachment.length, 1);
      assert.equal(doc.attachment.first.id, 'http://example.org/attachment');
      assert(doc.attributedTo);
      assert.equal(doc.attributedTo.length, 1);
      assert.equal(doc.attributedTo.first.id, 'http://sally.example.org');
      assert.equal(doc.content.get(), 'the content');
      assert(doc.context);
      assert.equal(doc.context.length, 1);
      assert.equal(doc.context.first.id, 'http://example.org/context');
      assert.equal(doc.name.get(), 'the display name');
      assert.equal(doc.endTime.valueOf(),
        new Date('2015-12-12T12:12:12Z').valueOf());
      assert(doc.generator);
      assert.equal(doc.generator.length, 1);
      assert.equal(doc.generator.first.id, 'http://example.org/generator');
      assert(doc.icon);
      assert.equal(doc.icon.length, 1);
      assert.equal(doc.icon.first.id, 'http://example.org/icon');
      assert(doc.image);
      assert.equal(doc.image.length, 1);
      assert.equal(doc.image.first.id, 'http://example.org/image');
      assert(doc.inReplyTo);
      assert.equal(doc.inReplyTo.length, 1);
      assert.equal(doc.inReplyTo.first.id, 'http://example.org/in-reply-to');
      assert(doc.location);
      assert.equal(doc.location.length, 1);
      assert.equal(doc.location.first.id, 'http://example.org/location');
      assert(doc.preview);
      assert.equal(doc.preview.length, 1);
      assert.equal(doc.preview.first.id, 'http://example.org/preview');
      assert(doc.tag);
      assert.equal(doc.tag.length, 1);
      assert.equal(doc.tag.first.id, 'http://example.org/tag');
      assert.equal(doc.updated.valueOf(),
        new Date('2015-12-12T12:12:12Z').valueOf());
      assert.equal(doc.published.valueOf(),
        new Date('2015-12-12T12:12:12Z').valueOf());
      assert(doc.replies);
      assert.equal(doc.replies.length, 1);
      assert.equal(doc.replies.first.id, 'http://example.org/replies');
      assert(doc.audience);
      assert.equal(doc.audience.length, 1);
      assert.equal(doc.audience.first.id, 'http://example.org/scope');
      assert(doc.url);
      assert.equal(doc.url.length, 1);
      assert.equal(doc.url.first.id, 'http://example.org');
      assert.equal(doc.startTime.valueOf(),
        new Date('2015-12-12T12:12:12Z').valueOf());
      assert(doc.to);
      assert.equal(doc.to.length, 1);
      assert.equal(doc.to.first.id, 'http://joe.example.org');
      assert(doc.bto);
      assert.equal(doc.bto.length, 1);
      assert.equal(doc.bto.first.id, 'http://sally.example.org');
      assert(doc.cc);
      assert.equal(doc.cc.length, 1);
      assert.equal(doc.cc.first.id, 'http://mark.example.org');
      assert(doc.bcc);
      assert.equal(doc.bcc.length, 1);
      assert.equal(doc.bcc.first.id, 'http://jane.example.org');
  });

  it('should have appropriate values for the relationship object', async () => {

      var test = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        'type': 'Relationship',
        subject: 'http://sally.example.org',
        relationship: 'http://example.org',
        object: 'http://joe.example.org'
      };

      const doc = await as.import(test);
      assert(doc instanceof as.models.Object);
      assert(doc.subject.id, 'http://sally.example.org');
      assert(doc.relationship);
      assert.equal(doc.relationship.length, 1);
      assert.equal(doc.relationship.first.id, 'http://example.org');
      assert(doc.object);
      assert.equal(doc.object.length, 1);
      assert.equal(doc.object.first.id, 'http://joe.example.org');
  });

  it('should have appropriate values for the relationship object', async () => {
    var doc = as.relationship()
      .subject('http://sally.example.org')
      .relationship('http://example.org')
      .object('http://joe.example.org')
      .get();

    assert(doc instanceof as.models.Object);
    assert(doc.subject.id, 'http://sally.example.org');
    assert(doc.relationship);
    assert.equal(doc.relationship.length, 1);
    assert.equal(doc.relationship.first.id, 'http://example.org');
    assert(doc.object);
    assert.equal(doc.object.length, 1);
    assert.equal(doc.object.first.id, 'http://joe.example.org');
  });

  it('should have appropriate values for the question object', async () => {
    var test = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      'type': 'Question',
      name: 'the question',
      anyOf: [{'id': 'urn:answer1'}, {'id': 'urn:answer2'}]
    };

    const doc = await as.import(test);
    assert(doc instanceof as.models.Object);
    assert.equal(doc.name.get(), 'the question');
    assert(doc.anyOf);
    assert.equal(doc.anyOf.length, 2);
    const iter = doc.anyOf[Symbol.iterator]();
    assert.equal(iter.next().value.id, 'urn:answer1');
    assert.equal(iter.next().value.id, 'urn:answer2');
  });

  it('should have appropriate values for the question object', async () => {
    var doc = as.question()
      .name('the question')
      .anyOf('urn:answer1')
      .anyOf('urn:answer2')
      .get();

    assert(doc instanceof as.models.Object);
    assert.equal(doc.name.get(), 'the question');
    assert(doc.anyOf);
    assert.equal(doc.anyOf.length, 2);
    const iter = doc.anyOf[Symbol.iterator]();
    assert.equal(iter.next().value.id, 'urn:answer1');
    assert.equal(iter.next().value.id, 'urn:answer2');
  });

  it('should have appropriate values for the place object', async () => {
    var test = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      'type': 'Place',
      accuracy: 10,
      altitude: 10,
      latitude: 10,
      longitude: 10,
      radius: 10,
      units: 'm'
    };

    const doc = await as.import(test);

    assert(doc instanceof as.models.Object);
    assert.equal(doc.accuracy, 10);
    assert.equal(doc.altitude, 10);
    assert.equal(doc.latitude, 10);
    assert.equal(doc.longitude, 10);
    assert.equal(doc.radius, 10);
    assert.equal(doc.units, 'm');
  });

  it('should have appropriate values for the place object', async () => {
    var doc = as.place()
      .accuracy(10)
      .altitude(10)
      .latitude(10)
      .longitude(10)
      .radius(10)
      .units('m')
      .get();

    assert(doc instanceof as.models.Object);
    assert.equal(doc.accuracy, 10);
    assert.equal(doc.altitude, 10);
    assert.equal(doc.latitude, 10);
    assert.equal(doc.longitude, 10);
    assert.equal(doc.radius, 10);
    assert.equal(doc.units, 'm');
  });

  it('should have appropriate values for the profile object', async () => {

    var test = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      'type': 'Profile',
      describes: 'http://example.org'
    };

    const doc = await as.import(test);
    assert(doc instanceof as.models.Object);
    assert.equal(doc.describes.id, 'http://example.org');
  });

  it('should have appropriate values for the profile object', async () => {
    var doc = as.profile()
      .describes('http://example.org')
      .get();

    assert(doc instanceof as.models.Object);
    assert.equal(doc.describes.id, 'http://example.org');
  });

  it('should use the default context', async () => {
    var test = {'id': 'urn:test', name: 'test'};
    const doc = await as.import(test);
    assert.equal(doc.id, 'urn:test');
    assert.equal(doc.name.get(), 'test');
  });

  it('Nothing in as vocab should be undefined', async () => {
    const keys = Object.keys(asv).filter((item) => {return !(asv[item]);});
    assert.equal(0, keys.length);
  });

  it('should have appropriate values for the ActivityPub collections', async () => {
    var doc = as.object()
      .inbox('https://evanp.example/inbox')
      .outbox('https://evanp.example/outbox')
      .followers('https://evanp.example/followers')
      .following('https://evanp.example/following')
      .liked('https://evanp.example/liked')
      .get();

    assert(doc instanceof as.models.Object);
    assert.equal(doc.inbox.first.id, 'https://evanp.example/inbox');
    assert.equal(doc.outbox.first.id, 'https://evanp.example/outbox');
    assert.equal(doc.followers.first.id, 'https://evanp.example/followers');
    assert.equal(doc.following.first.id, 'https://evanp.example/following');
    assert.equal(doc.liked.first.id, 'https://evanp.example/liked');

    const result = await doc.export();

    assert.equal(typeof(result), "object");
    assert.equal(result.inbox, 'https://evanp.example/inbox');
    assert.equal(result.outbox, 'https://evanp.example/outbox');
    assert.equal(result.followers, 'https://evanp.example/followers');
    assert.equal(result.following, 'https://evanp.example/following');
    assert.equal(result.liked, 'https://evanp.example/liked');
  });
});

describe('Streaming...', () => {

  it('Should read and parse from the stream', (done) => {
    var fs = require('fs');
    var AS2Stream = as.Stream;
    var path = require('path');
    var through = require('through2');

    fs.createReadStream(path.resolve(__dirname, 'test.json'))
      .pipe(new AS2Stream())
      .pipe(through.obj((chunk) => {
        assert(chunk);
        assert(chunk.type);
        assert.equal(chunk.type, asv.Person);
        assert.equal(chunk.name.get(), 'Sally');
        done();
      }));
  });

  it('Should write to the stream', (done) => {
    var AS2Stream = as.Stream;
    var through = require('through2');
    var obj = as.object().name('test').get();
    obj.stream()
      .pipe(new AS2Stream())
      .pipe(through.obj((chunk) => {
        assert(chunk);
        assert(chunk.type);
        assert.equal(chunk.name.valueOf(), 'test');
      }));
    done();
  });
});

describe('Templates...', () => {
  it('Should use one object as a template for another', (done) => {
    var tmpl = as.like().actor(as.person().name('Joe')).template();
    var like = tmpl().object('http://example.org/foo').get();
    assert(like.actor);
    assert.equal(like.actor.first.name.get(), 'Joe');
    assert(like.object);
    assert.equal(like.object.first.id, 'http://example.org/foo');
    assert(!tmpl.object);
    done();
  });

  it('should allow a value to be removed or replaced', (done) => {
    const tmpl = as.like().actor(as.person().name('Joe')).template();
    const like = tmpl().actor().get();
    assert(!like.actor);
    done();
  });

});

describe('Extensions...', () => {
  it('should initialize the Interval and Social Extensions', (done) => {
    as.use(as.interval);
    as.use(as.social);
    assert.equal(require('../src/extcontext.js').get().length, 2);
    done();
  });

  it('should create interval objects with appropriate type and values',
  (done) => {
    [
      ['open', interval.OpenInterval],
      ['closed', interval.ClosedInterval],
      ['openClosed', interval.OpenClosedInterval],
      ['closedOpen', interval.ClosedOpenInterval],
      ['leftOpen', interval.LeftOpenInterval],
      ['rightOpen', interval.RightOpenInterval],
      ['leftClosed', interval.LeftClosedInterval],
      ['rightClosed', interval.RightClosedInterval],
    ].forEach((key) => {
      var obj = as.interval[key[0]]()
      .upper(1)
      .lower(0)
      .step(1)
      .get();
      assert(obj instanceof as.models.Object);
      assert.equal(obj.type, key[1]);
      assert.equal(obj.upper, 1);
      assert.equal(obj.lower, 0);
      assert.equal(obj.step, 1);
    });
    done();
  });

  it('should create population objects with appropriate type', (done) => {
    [
      ['population', social.Population],
      ['everyone', social.Everyone],
      ['public', social.Public],
      ['private', social.Private],
      ['direct', social.Direct],
      ['common', social.Common],
      ['interested', social.Interested],
      ['self', social.Self],
      ['all', social.All],
      ['any', social.Any],
      ['none', social.None],
      ['compoundPopulation', social.CompoundPopulation]
    ].forEach((key) => {
      var obj = as.social[key[0]]().get();
      assert(obj instanceof as.models.Object);
      assert.equal(obj.type, key[1]);
    });
    done();
  });

  it("should allow using .set() when the @context is an array", async () => {
    const string = await as.activity()
      .context([
          'https://www.w3.org/ns/activitystreams',
          { vcard: 'http://www.w3.org/2006/vcard/ns#' }
      ])
      .actor(
          as.person()
              .name('Denis Prša')
              .id('https://github.com/denisprsa')
      )
      .object(
          as.offer()
              .name('Thank you')
              .id('https://github.com/jasnell/activitystrea.ms/issues/13#issuecomment-376722358')
              .set('vcard:given-name', 'Thank')
      )
      .name('The offer')
      .content('Evan offered his thanks to Denis for his bug report')
      .set({h: 'd'})
      .published(new Date())
      .prettyWrite();

    assert(string);
  })
});
