import React from 'react'
import { fromEvent } from 'rxjs'
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { useFetch } from './helpers'
import Loading from './Loading'

let renderOptions;

export default function Translator() {
  // fetch all supported languages after first render from Yandex API
  // to fill the [base-target] select elements
  const { loading, error, data: { langs } } = useFetch({
    key: 'languages',
    req: ['get','https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=trnsl.1.1.20190222T204521Z.55a390e0140bcbfe.09d6b0890e590eb79a0feb92abdd5f6695940df5&ui=en'],
    deps: []
  });
  // the base lang value
  const [base, setBase] = React.useState('en');
  // the target lang value
  const [target, setTarget] = React.useState('ar');
  // the input textarea element ref
  const inputEl = React.useRef(null);
  // the input textarea element value
  const [input, setInput] = React.useState('');
  // the text to be translated [filled from the input after debounce 1 second]
  const [text, setText] = React.useState('');
  // the translated text
  const [translation, setTranslation] = React.useState('');

  // when langs [all supported languages] fulfilled
  // subscribe to the input event of inputEl ref using rxjs
  React.useEffect(
    () => {
      if(inputEl.current) {
        // Create an Observable that will publish input chars
        // map the event to the chars value
        // debounce it 1 second
        // get the distinct value [diff from the last one]
        // subscribe and set the text state
        const subscription = fromEvent(inputEl.current, 'input')
          .pipe(
            map(e => e.target.value),
            debounceTime(1000),
            distinctUntilChanged())
          .subscribe(val => setText(val.trim()) );
        // finally return the clean up function that remove the subscription
        return () => void subscription.unsubscribe();
      }
    }, [langs]);
  // when text state changes then get the translated text from Yandex API
  const { data } = useFetch({
    key: text.replace(/ /g, '_'),
    req: ['get', `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190222T204521Z.55a390e0140bcbfe.09d6b0890e590eb79a0feb92abdd5f6695940df5&lang=${base}-${target}&text=${text}`],
    deps: [text]
  });
  // when translated text comes then set the translation state value
  // to update the translation textarea element value
  React.useEffect(
    () => void setTranslation( (data.text)? data.text : '' ),
    [data]
  );
  // swap the selected [base - target] langs
  const swapLangs = () => {
    setBase(target);
    setTarget(base);
  }
  // the rendered options filled from the langs when it comes
  if(langs)
    renderOptions = Object.keys(langs).map(key => (<option key={key} value={key}>{langs[key]} ({key})</option>) );
  // render loading when the langs request is pending
  if(loading)
    return <Loading />
  // render the error message if there is one [langs request]
  if(error)
    return <div className="alert alert-danger" role="alert">{error}</div>
  // render the translator jsx when the langs comes
  if(langs)
    return (
      <div className="card w-75 mx-auto my-3">
        <div className="card-header alert alert-success text-center">
          <div className="flex-around">
            <div className="mx-2 my-2">
              <label className="mr-sm-2 sr-only" htmlFor="base">Base Language</label>
              <select id="base" className="custom-select mr-sm-2"
                value={base}
                onChange={e => setBase(e.target.value)} >
                <option value="">Choose base ...</option>
                {renderOptions}
              </select>
            </div>
            <div className="mx-2 my-2">
              <button className="btn btn-success" onClick={swapLangs}>
                <i className="fas fa-exchange-alt"></i>
              </button>
            </div>
            <div className="mx-2 my-2">
              <label className="mr-sm-2 sr-only" htmlFor="target">Target Language</label>
              <select id="target" className="custom-select mr-sm-2"
                value={target}
                onChange={e => setTarget(e.target.value)} >
                <option value="">Choose Target ...</option>
                {renderOptions}
              </select>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="flex-between">
            <label className="mr-sm-2 sr-only" htmlFor="input">Text</label>
            <textarea id="input" className="form-control"
              placeholder="Enter Text ..."
              ref={inputEl}
              value={input}
              onChange={ e => setInput(e.target.value) } />
            <div className="mx-2"></div>
            <label className="mr-sm-2 sr-only" htmlFor="translation">Translation</label>
            <textarea id="translation" className="form-control"
              placeholder="Translation ..."
              value={translation}
              readOnly={true} />
          </div>
        </div>
        <div className="card-footer text-center text-light bg-secondary">
          Powered by Yandex Translation API
        </div>
      </div>
    )
  return null;
}