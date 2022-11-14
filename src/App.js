import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import CreatableSelect from 'react-select/creatable';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);
  const { register, handleSubmit, control, reset } = useForm()
  console.log(value);
  const handleCreate = (inputValue) => {
    setIsLoading(true);
    setTimeout(() => {
      const ctgCreate = { name: inputValue }
      axios.post("http://localhost:3004/category", ctgCreate)
        .then((res) => {
          console.log("ctgCreate", res.data)
          const newCreate = { label: res.data.name, value: res.data.id }
          setOptions((prev) => [...prev, newCreate]);
          setValue(newCreate);
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false))
    }, 1000);
  };

  const handleSubmitForm = (data) => {
    const storeData = { ...data, category_id: value?.value }
    axios.post("http://localhost:3004/post", storeData).then((res) => { 
      reset()
      setValue(null)
    }).catch((error) => console.log(error))
  }

  const categoryFetch = () => {
    axios.get("http://localhost:3004/category")
      .then((res) => {
        let category = []
        res.data.forEach((item) => {
          category.push({ label: item.name, value: item.id });
        })
        setOptions(category);
      })
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    categoryFetch()
  }, [])

  return (
    <div style={{ padding: '10rem' }}>
      <form onSubmit={handleSubmit(handleSubmitForm)} >
        <div>
          <CreatableSelect
            isClearable
            isDisabled={isLoading}
            isLoading={isLoading}
            onChange={(newValue) => setValue(newValue)}
            onCreateOption={handleCreate}
            options={options}
            value={value}
          />

        </div>
        <div>
          <input {...register("body")} placeholder='body' />
        </div>
        <div>
          <button type='submit'>submit</button>
        </div>
      </form>
    </div>
  )
}

export default App