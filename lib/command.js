import { Fragment, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { SearchIcon } from '@heroicons/react/solid'
import { Combobox, Dialog, Transition } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Foo({ posts }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  useHotkeys('command+k,ctrl+k', () => setOpen(true));

  const filteredPosts = posts.filter((post) => {
    const postName = post.properties.Name.title[0].plain_text.toLowerCase()
    return query !== '' && postName.includes(query.toLowerCase())
  });

  return (
    <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery('')}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Combobox
            as="div"
            className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
            onChange={(post) => (window.location = `/${post.properties.Slug.url}`)}
          >
            <div className="relative">
              <SearchIcon
                className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <Combobox.Input
                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm"
                placeholder="What are you looking for?"
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            {filteredPosts.length > 0 && (
              <Combobox.Options static className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800">
                {filteredPosts.map((post) => (
                  <Combobox.Option
                    key={post.id}
                    value={post}
                    className={({ active }) =>
                      classNames('cursor-default select-none px-4 py-2', active && 'bg-indigo-600 text-white')
                    }
                  >
                    {post.properties.Name.title[0].plain_text}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}

            {query !== '' && filteredPosts.length === 0 && (
              <p className="p-4 text-sm text-gray-500">No posts found.</p>
            )}
          </Combobox>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  )
}
