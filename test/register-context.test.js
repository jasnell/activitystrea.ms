const assert = require('assert');
const as = require('../src/activitystreams');

describe('Register context...', () => {
  const url = 'https://example.com/context';
  const context = {
    '@context': {
      'ex': 'https://example.com/context#',
      'Foo': {
        '@id': 'ex:Foo',
        '@type': '@id'
      },
      'bar': 'ex:bar',
    }
  };
  let foo = null
  const docContext = ['https://www.w3.org/ns/activitystreams', url]

  it('can register a context document', async () => {
    assert.doesNotThrow(() => as.registerContext(url, context))
  })

  it('can import a document with the url in the @context', async () => {
    foo = await as.import({
      '@context': docContext,
      id: 'https://social.example/foo/1',
      type: 'Foo',
      'bar': 3
    })
    assert.ok(foo);
    assert.equal(foo.type, 'https://example.com/context#Foo');
    assert.equal(foo.get('https://example.com/context#bar').first, 3);
  });

  it('can export a document with the url in the @context', async () => {
    const exFoo = await foo.export({
      useOriginalContext: true
    })
    assert.ok(exFoo);
    assert.equal(exFoo.type, 'Foo');
    assert.equal(exFoo.bar, 3);
  });
})