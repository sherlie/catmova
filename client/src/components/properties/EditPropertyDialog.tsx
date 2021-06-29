import React, { useState, FC } from 'react';

import {
  PropertyType,
  partOfSpeechLabel,
  Property,
  propertyTypeLabel,
} from '../../api/types';
import { updateProperty } from '../../api/client';
import '../App.css';
import { useMutation } from '../../api/useMutation';
import { useLangSelector } from '../../store';

interface PropetyDialogProps {
  property: Property;
  onClose: () => void;
}

const EditPropetyDialog: FC<PropetyDialogProps> = ({ property, onClose }) => {
  const selectedLang = useLangSelector();
  const [inputList, setInputList] = useState<string[]>(['']);
  const [name, setName] = useState<string>(property.name);

  const handleSubmit = async () => {
    await editProperty();
    onClose();
  };

  const [editProperty, { loading }] = useMutation(() =>
    updateProperty(
      {
        name,
        type: property.type,
        langId: selectedLang!.id,
        partOfSpeech: property.partOfSpeech,
        options:
          property.type === PropertyType['Single Option'] ||
          property.type === PropertyType['Multi Option']
            ? inputList
            : undefined,
        //table:  property.type === CustomType.Table ? inputList : undefined,
      },
      property.id,
    ),
  );

  const handleInputChange = (value: string, index: number) => {
    const list = [...inputList];
    list[index] = value;
    setInputList(list);
  };

  return (
    <div className='dialog-overlay' onClick={onClose}>
      <dialog
        open
        className='center dialog'
        onClick={(event) => event.stopPropagation()}
      >
        <div className='sticky'>
          <a className='topright' onClick={onClose}>
            <i className='fas fa-window-close'></i>
          </a>
          <h3>Edit Property</h3>
        </div>
        <p>
          <label>PROPERTY NAME</label>
          <br />
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            className='basic-slide'
            placeholder='Property name'
          />
        </p>
        <p>
          <label>PROPERTY TYPE: {propertyTypeLabel(property.type)}</label>
        </p>
        <p>
          <label>
            PART OF SPEECH: {partOfSpeechLabel(property.partOfSpeech)}
          </label>
          <br />
          {/* <select
            className='basic-slide'
            onChange={(event) => setPos(event.target.value)}
            value={pos}
          >
            {Object.entries(PartOfSpeech).map(([posName, posValue]) => (
              <option className='option' key={posValue} value={posValue}>
                {posName}
              </option>
            ))}
          </select> */}
        </p>
        {property.type === 'text' && <div />}
        {(property.type === 'single' || property.type === 'multi') && (
          <div>
            <label>OPTIONS</label>
            {property.options &&
              Object.entries(property.options).map(([key, option], i) => {
                return (
                  <div className='box' key={key}>
                    <input
                      className='basic-slide'
                      name='firstName'
                      placeholder='Enter property option'
                      value={option}
                      onChange={(e) => handleInputChange(e.target.value, i)}
                    />
                  </div>
                );
              })}
          </div>
        )}
        <button className='confirm-button' onClick={() => handleSubmit()}>
          SUMBIT
        </button>
      </dialog>
    </div>
  );
};

export default EditPropetyDialog;
