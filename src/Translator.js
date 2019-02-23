import React from 'react'
import { useFetch } from './helpers'
import Loading from './Loading'

export default function Translator() {

  const { loading, error, data: { langs } } = useFetch({
    key: 'languages',
    req: ['get','https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=trnsl.1.1.20190222T204521Z.55a390e0140bcbfe.09d6b0890e590eb79a0feb92abdd5f6695940df5&ui=en'],
    deps: []
  });

  const [base, setBase] = React.useState('USD');
  const [target, setTarget] = React.useState('EGP');

  let renderOptions = null
  if(langs)
    renderOptions = Object.keys(langs).map(key => (<option key={key} value={key}>{`${key} - ${langs[key]}`}</option>) );

  if(loading)
    return <Loading />
  if(error)
    return <div className="alert alert-danger" role="alert">{error}</div>
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
              <button className="btn btn-success">
                <i class="fas fa-exchange-alt"></i>
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
            <label className="mr-sm-2 sr-only" htmlFor="text">Text</label>
            <textarea id="text" className="form-control" placeholder="Enter Text ..." />
            <div className="mx-2"></div>
            <label className="mr-sm-2 sr-only" htmlFor="translation">Translation</label>
            <textarea id="translation" className="form-control" placeholder="Translation ..." />
          </div>
        </div>
        <div className="card-footer text-center text-light bg-secondary">
          Powered by Yandex Translation API
        </div>
      </div>
    )
  return null;
}